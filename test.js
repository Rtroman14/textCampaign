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

<<<<<<< HEAD
        // campaigns = campaigns.filter(
        //     (campaign) =>
        //         campaign.Client === "Summa Media" || campaign.Client === "Valley Hill Roofing"
        // );

=======
<<<<<<< HEAD
        let [campaign] = campaigns.filter((campaign) => campaign.Client === "A Best Roofing");

        let view = "Text";

        if ("Tag" in campaign) {
            view = `Text - ${campaign.Tag}`;
        }

        const contacts = await Airtable.getContacts(campaign["Base ID"], view);

        console.log(contacts.length);
=======
>>>>>>> 7292fb5f83222aa7c0494cb82cdebd1e2676370f
        console.log(campaigns);
>>>>>>> e5810a904639b17034c90a7ed22cfba01ba0f09b
    } catch (error) {
        console.log(error.message);
    }
})();
