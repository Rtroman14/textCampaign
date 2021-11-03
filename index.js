require("dotenv").config();

const moment = require("moment");

const textOutreach = require("./src/textContact");
const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 60;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let accounts = Helpers.accountsToRun(getCampaigns);

        await slackNotification("Launching texts...");

        for (let i = 1; i < numContacts + 1; i++) {
            const arrayTextOutreach = accounts.map((account) => textOutreach(account));

            const results = await Promise.all(arrayTextOutreach);

            for (let result of results) {
                if (result.status === "Need More Contacts") {
                    if (i > 2) {
                        await Airtable.updateCampaign(result.recordID, {
                            "Campaign Status": result.status,
                            "Last Updated": today,
                            "Contacts Left": 0,
                        });
                    } else {
                        await Airtable.updateCampaign(result.recordID, {
                            "Campaign Status": result.status,
                            "Contacts Left": 0,
                        });
                    }

                    // remove account from list
                    accounts = accounts.filter(
                        (currentAccount) => currentAccount.Account !== result.Account
                    );
                }
            }

            // if (i === numContacts) {
            //     const contacts = await Airtable.getContacts(account["Base ID"], view);

            //     await Airtable.updateCampaign(account.recordID, {
            //         "Campaign Status": "Live",
            //         "Contacts Left": contacts.length,
            //         "Last Updated": today,
            //     });

            //     if (contacts.length <= 150) {
            //         await slackNotification(
            //             `\n*Account:* ${account.Account}\n*Campaign:* ${account.Campaign} \n*Number of contacts:* ${contacts.length}\n`
            //         );
            //     }
            // } else {
            // }

            console.log(`\n --- Texts sent: ${i} --- \n`);
            await Helpers.minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
