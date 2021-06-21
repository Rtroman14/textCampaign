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
        campaigns = campaignsDueToday(campaigns);
        campaigns = campaignsToRun(campaigns);

        let [campaign] = campaigns.filter((campaign) => campaign.Client === "A Best Roofing");

        let view = "Text";

        if ("Tag" in campaign) {
            view = `Text - ${campaign.Tag}`;
        }

        const contacts = await Airtable.getContacts(campaign["Base ID"], view);

        console.log(contacts.length);
    } catch (error) {
        console.log(error.message);
    }
})();
