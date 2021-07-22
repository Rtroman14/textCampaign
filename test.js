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

        let campaign = campaigns.find((campaign) => campaign.Client === "Greenscape");

        let view = "Text";

        if ("Tag" in campaign) {
            view = `Text - ${campaign.Tag}`;
        }

        const contact = await Airtable.getContact(campaign["Base ID"], view);

        if (contact) {
            const highLevelContact = mapContact(contact);

            if (campaign.Client === "Greenscape") {
                await axios.post(
                    "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                    highLevelContact
                );

                console.log("Sent contact to pipedrive", highLevelContact);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
