require("dotenv").config();

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const slackNotification = require("./src/slackNotification");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const { campaignsDueToday, liveCampaigns, campaignsToRun } = require("./src/helpers");

(async () => {
    try {
        // const getCampaigns = await Airtable.getCampaigns();
        // let campaigns = liveCampaigns(getCampaigns);
        // campaigns = campaignsDueToday(campaigns);
        // campaigns = campaignsToRun(campaigns);
        // console.log(campaigns);

        const contacts = await Airtable.getContacts("appjxmBfr90miizyO", "Text");
        console.log(contacts.length);
    } catch (error) {
        console.log(error.message);
    }
})();
