const moment = require("moment");

const AirtableApi = require("./src/airtable");
const { filterCampaigns, mapContact, minutesWait } = require("./src/helpers");
const highLevel = require("./src/highLevel");

const Airtable = new AirtableApi("key2tZxeaXDfyBJ9k");

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 50;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();

        let campaigns = filterCampaigns(getCampaigns);

        for (let i = 0; i < numContacts; i++) {
            for (let campaign of campaigns) {
                let baseName = "First Line Ready";

                if ("Tag" in campaign) {
                    baseName = `First Line Ready - ${campaign.Tag}`;
                }

                const contact = await Airtable.getContact(campaign.baseID, baseName);

                if (contact) {
                    const highLevelContact = mapContact(contact);

                    try {
                        const texted = await highLevel(campaign["Highlevel Key"], highLevelContact);

                        if (texted.status == "200") {
                            await Airtable.updateContact(
                                campaign.baseID,
                                baseName,
                                campaign.recordID,
                                {
                                    Texted: true,
                                    "In Campaign": true,
                                    "Upload Date": today,
                                    Campaign: campaign.Campaign,
                                }
                            );

                            console.log(`${campaign.Client} texted: ${highLevelContact.name}`);
                        }
                    } catch (error) {
                        await Airtable.updateContact(campaign.baseID, baseName, campaign.recordID, {
                            Error: true,
                            "Upload Date": today,
                        });

                        console.log(
                            `ERROR TEXTING CONTACT --- ${campaign.Client} --- ${error.message}`
                        );
                    }
                } else {
                    // remove campaign from list
                    campaigns = campaigns.filter(
                        (currentCampaign) => currentCampaign.Client !== campaign.Client
                    );

                    // update campaign notes to say "Need to add contacts"
                    await Airtable.updateCampaign(campaign.recordID, {
                        "Campaign Status": "Need More Contacts",
                        "Last Updated": today,
                    });
                }
            }

            await minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
