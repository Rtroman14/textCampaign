require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const {
    liveCampaigns,
    mapContact,
    minutesWait,
    campaignsToRun,
    campaignsDueToday,
} = require("./src/helpers");
const slackNotification = require("./src/slackNotification");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 50;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let campaigns = liveCampaigns(getCampaigns);
        campaigns = campaignsDueToday(campaigns);
        campaigns = campaignsToRun(campaigns);

        // campaigns = campaigns.filter(
        //     (campaign) =>
        //         campaign.Client === "Valley Hill Roofing" ||
        //         campaign.Client === "Armor Shield" ||
        //         campaign.Client === "Summa Media" ||
        //         campaign.Client === "D&D Roofing Consultants"
        // );

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

                            console.log(
                                `Client: ${campaign.Client} | Campaign: ${campaign.Campaign} | texted: ${highLevelContact.name}`
                            );
                        }

                        if (
                            numContacts === 1 &&
                            campaign["Campaign Status"] === "Need More Contacts"
                        ) {
                            await Airtable.updateCampaign(campaign.recordID, {
                                "Campaign Status": "Live",
                            });
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

                    if (numContacts > 10) {
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

                if (i === numContacts - 1) {
                    const contacts = await Airtable.getContacts(campaign["Base ID"], view);

                    await Airtable.updateCampaign(campaign.recordID, {
                        "Campaign Status": "Need More Contacts",
                        "Contacts Left": contacts.length,
                    });

                    if (contacts.length < 100) {
                        await slackNotification(
                            `\n*Client:* ${campaign.Client}\n*Campaign:* ${campaign.Campaign} \n*Number of contacts:* ${contacts.length}\n`
                        );
                    }
                }
            }

            console.log(`\n --- Texts sent: ${i + 1} --- \n`);
            await minutesWait(2);
        }

        for (let campaign of campaigns) {
            // run at the end of loop

            if (campaign["Campaign Status"] === "Need More Contacts)") {
                await Airtable.updateCampaign(campaign.recordID, {
                    "Last Updated": today,
                    "Campaign Status": "Live",
                });
            } else {
                await Airtable.updateCampaign(campaign.recordID, {
                    "Last Updated": today,
                });
            }

            await minutesWait(0.05);
        }
    } catch (error) {
        console.log(error);
    }
})();
