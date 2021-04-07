require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const { liveCampaigns, mapContact, minutesWait } = require("./src/helpers");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 50;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();

        let campaigns = liveCampaigns(getCampaigns);

        for (let i = 0; i < numContacts; i++) {
            for (let campaign of campaigns) {
                const Highlevel = new HighlevelApi(campaign["API Token"]);

                let view = "Text";

                if ("Tag" in campaign) {
                    view = `Text - ${campaign.Tag}`;
                }

                const contact = await Airtable.getContact(campaign["Base ID"], view);

                if (contact) {
                    const highLevelContact = mapContact(contact);

                    try {
                        const texted = await Highlevel.textContact(
                            highLevelContact,
                            campaign["Campaign ID"]
                        );

                        if (texted.status == "200") {
                            await Airtable.updateContact(campaign["Base ID"], contact.recordID, {
                                "In Campaign": true,
                                Campaign: campaign.Campaign,
                            });

                            console.log(`${campaign.Client} texted: ${highLevelContact.name}`);
                        }
                    } catch (error) {
                        // RUNS IF ERROR WHILE TEXTING
                        await Airtable.updateContact(campaign["Base ID"], contact.recordID, {
                            Error: true,
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

                    await Airtable.updateCampaign(campaign.recordID, {
                        "Campaign Status": "Need More Contacts",
                        "Last Updated": today,
                    });
                }
            }

            await minutesWait(2);
        }

        // run at the end of loop
        await Airtable.updateCampaign(campaign.recordID, {
            "Last Updated": today,
        });
    } catch (error) {
        console.log(error);
    }
})();
