require("dotenv").config();

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const { campaignsDueToday, liveCampaigns, campaignsToRun } = require("./src/helpers");

const slackNotification = require("./src/slackNotification");

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let campaigns = liveCampaigns(getCampaigns);
        // campaigns = campaignsDueToday(campaigns);
        // campaigns = campaignsToRun(campaigns);

        // console.log(campaigns);

        for (let campaign of campaigns) {
            let view = "Text";

            if ("Tag" in campaign) {
                view = `Text - ${campaign.Tag}`;
            }

            const contacts = await Airtable.getContacts(campaign["Base ID"], view);
            if (contacts.length < 100) {
                await slackNotification(
                    `${campaign.Client}'s campaign: ${campaign.Campaign} has ${contacts.length} contacts remaining.`
                );

                console.log(
                    `${campaign.Client}'s campaign: ${campaign.Campaign} has ${contacts.length} contacts remaining.`
                );
            }
        }
    } catch (error) {
        console.log(error.message);
    }
})();
