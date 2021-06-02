require("dotenv").config();

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const { campaignsDueToday, liveCampaigns, campaignsToRun } = require("./src/helpers");

const slackNotification = require("./src/slackNotification");

const moment = require("moment");
const today = moment(new Date()).format("MM/DD/YYYY");

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let campaigns = liveCampaigns(getCampaigns);
        // campaigns = campaignsDueToday(campaigns);
        // campaigns = campaignsToRun(campaigns);

        console.log(campaigns);
<<<<<<< HEAD
=======

        console.log(campaigns);
>>>>>>> 2268259af298e1556334ee577a8aafc91a8db6f7
    } catch (error) {
        console.log(error.message);
    }
})();
