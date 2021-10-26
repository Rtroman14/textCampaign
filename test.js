require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const HelpersApi = require("./src/Helpers");
const Helpers = new HelpersApi();

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let accounts = Helpers.accountsToRun(getCampaigns);

        let account = accounts.find((el) => el.Client === "Summa Media");

        const Highlevel = new HighlevelApi(account["API Token"]);

        let view = "Text";

        if ("Tag" in account) {
            view = `Text - ${account.Tag}`;
        }

        const contact = await Airtable.getContact(account["Base ID"], view);

        console.log(contact);

        if (contact) {
            const highLevelContact = Helpers.mapContact(contact);

            const texted = await Highlevel.textContact(highLevelContact, account["Campaign ID"]);

            if (texted.status == "200") {
                await Airtable.updateContact(account["Base ID"], contact.recordID, {
                    "In Campaign": true,
                    Campaign: account.Campaign,
                    "Highlevel ID": texted.id,
                });

                console.log(
                    `Account: ${account.Account} | Campaign: ${account.Campaign} | texted: ${highLevelContact.name}`
                );

                // if (account.Client === "Greenscape") {
                //     await axios.post(
                //         "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                //         highLevelContact
                //     );
                // }
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
