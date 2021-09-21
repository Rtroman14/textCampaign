require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const HelpersApi = require("./src/Helpers");

const Helpers = new HelpersApi();
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const slackNotification = require("./src/slackNotification");

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 50;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let campaigns = Helpers.liveCampaigns(getCampaigns);
        campaigns = Helpers.campaignsDueToday(campaigns);
        campaigns = Helpers.campaignsToRun(campaigns);

        // campaigns = campaigns.filter(
        //     (campaign) =>
        //         campaign.Client === "XL Roofing" ||
        //         campaign.Client === "Greenscape" ||
        //         campaign.Client === "Red Leaf Solutions" ||
        //         campaign.Client === "Built Right Roofing"
        // );

        await slackNotification("Launching texts...");

        for (let i = 1; i < numContacts + 1; i++) {
            for (let campaign of campaigns) {
                const Highlevel = new HighlevelApi(campaign["API Token"]);

                let view = "Text";

                if ("Tag" in campaign) {
                    view = `Text - ${campaign.Tag}`;
                }

                const contact = await Airtable.getContact(campaign["Base ID"], view);

                if (contact) {
                    const highLevelContact = Helpers.mapContact(contact);

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

                            console.log(
                                `Client: ${campaign.Client} | Campaign: ${campaign.Campaign} | texted: ${highLevelContact.name}`
                            );

                            if (campaign.Client === "Greenscape") {
                                await axios.post(
                                    "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                                    highLevelContact
                                );
                            }
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
                        (currentCampaign) => currentCampaign.Campaign !== campaign.Campaign
                    );

                    if (i > 2) {
                        await Airtable.updateCampaign(campaign.recordID, {
                            "Campaign Status": "Need More Contacts",
                            "Last Updated": today,
                            "Contacts Left": 0,
                        });
                    } else {
                        await Airtable.updateCampaign(campaign.recordID, {
                            "Campaign Status": "Need More Contacts",
                            "Contacts Left": 0,
                        });
                    }

                    await slackNotification(
                        `\n*Client:* ${campaign.Client}\n*Campaign:* ${campaign.Campaign} \n*Number of contacts:* 0\n`
                    );
                }

                if (i === numContacts) {
                    const contacts = await Airtable.getContacts(campaign["Base ID"], view);

                    await Airtable.updateCampaign(campaign.recordID, {
                        "Campaign Status": "Live",
                        "Contacts Left": contacts.length,
                        "Last Updated": today,
                    });

                    if (contacts.length <= 150) {
                        await slackNotification(
                            `\n*Client:* ${campaign.Client}\n*Campaign:* ${campaign.Campaign} \n*Number of contacts:* ${contacts.length}\n`
                        );
                    }
                } else {
                }
            }

            console.log(`\n --- Texts sent: ${i} --- \n`);
            await Helpers.minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
