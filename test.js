require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const {
    liveCampaigns,
    mapContact,
    minutesWait,
    campaignsToRun,
    campaignsDueToday,
    campaignsToRunTest,
} = require("./src/helpers");
const slackNotification = require("./src/slackNotification");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 50;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        // let campaigns = liveCampaigns(getCampaigns);
        // campaigns = campaignsDueToday(campaigns);
        // campaigns = campaignsToRun(campaigns);

        // console.log(campaigns);

        const campaigns = campaignsToRunTest(getCampaigns);

        console.log(campaigns);
        console.log(campaigns.length);
    } catch (error) {
        console.log(error);
    }
})();
