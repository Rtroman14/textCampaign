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

const numContacts = 60;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let accounts = Helpers.accountsToRun(getCampaigns);

        accounts = accounts.filter(
            (account) =>
                account.Account !== "Berrong" &&
                account.Account !== "Guardian Construction Group" &&
                account.Account !== "HD Roofing" &&
                account.Account !== "Red Leaf Solutions"
        );

        // accounts = accounts.filter(
        //     (account) =>
        //         account.Account === "Berrong" ||
        //         account.Account === "Guardian Construction Group" ||
        //         account.Account === "HD Roofing" ||
        //         account.Account === "Red Leaf Solutions"
        // );

        // accounts = accounts.filter((account) => account.Account === "XL Roofing");

        await slackNotification("Launching texts...");

        for (let i = 1; i < numContacts + 1; i++) {
            for (let account of accounts) {
                const Highlevel = new HighlevelApi(account["API Token"]);

                let view = "Text";

                if ("Tag" in account) {
                    view = `Text - ${account.Tag}`;
                }

                const contact = await Airtable.getContact(account["Base ID"], view);

                if (contact) {
                    const highLevelContact = Helpers.mapContact(contact);

                    try {
                        const texted = await Highlevel.textContact(
                            highLevelContact,
                            account["Campaign ID"]
                        );

                        if (texted.status == "200") {
                            await Airtable.updateContact(account["Base ID"], contact.recordID, {
                                "In Campaign": true,
                                Campaign: account.Campaign,
                                "Highlevel ID": texted.id,
                            });

                            console.log(
                                `Account: ${account.Account} | Campaign: ${account.Campaign} | texted: ${highLevelContact.name}`
                            );

                            if (account.Client === "Greenscape") {
                                await axios.post(
                                    "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                                    highLevelContact
                                );
                            }
                        }
                    } catch (error) {
                        // RUNS IF ERROR WHILE TEXTING
                        await Airtable.updateContact(account["Base ID"], contact.recordID, {
                            Error: true,
                        });

                        console.log(
                            `ERROR TEXTING CONTACT --- ${account.Client} --- ${error.message}`
                        );
                    }
                } else {
                    // remove account from list
                    accounts = accounts.filter(
                        (currentCampaign) => currentCampaign.Campaign !== account.Campaign
                    );

                    if (i > 2) {
                        await Airtable.updateCampaign(account.recordID, {
                            "Campaign Status": "Need More Contacts",
                            "Last Updated": today,
                            "Contacts Left": 0,
                        });
                    } else {
                        await Airtable.updateCampaign(account.recordID, {
                            "Campaign Status": "Need More Contacts",
                            "Contacts Left": 0,
                        });
                    }

                    await slackNotification(
                        `\n*Account:* ${account.Account}\n*Campaign:* ${account.Campaign} \n*Number of contacts:* 0\n`
                    );
                }

                if (i === numContacts) {
                    const contacts = await Airtable.getContacts(account["Base ID"], view);

                    await Airtable.updateCampaign(account.recordID, {
                        "Campaign Status": "Live",
                        "Contacts Left": contacts.length,
                        "Last Updated": today,
                    });

                    if (contacts.length <= 150) {
                        await slackNotification(
                            `\n*Account:* ${account.Account}\n*Campaign:* ${account.Campaign} \n*Number of contacts:* ${contacts.length}\n`
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
