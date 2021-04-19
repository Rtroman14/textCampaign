require("dotenv").config();

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const { campaignsDueToday, liveCampaigns, campaignsToRun } = require("./src/helpers");

(async () => {
    try {
        // const getCampaigns = await Airtable.getCampaigns();
        // let campaigns = liveCampaigns(getCampaigns);
        // campaigns = campaignsDueToday(campaigns);
        // campaigns = campaignsToRun(campaigns);

        // console.log(campaigns);

        //
        const contacts = await Airtable.getContacts("appLVlpoe7RYAQfm9", "Text - denver");

        console.log(contacts.length);

        if (contacts.length < 100) {
            // await slackNotification(
            //     `${campaign.Client}'s campaign: ${campaign.Campaign} has ${contacts.length} contacts remaining.`
            // );

            console.log(
                `${campaign.Client}'s campaign: ${campaign.Campaign} has ${contacts.length} contacts remaining.`
            );
        }
    } catch (error) {
        console.log(error.message);
    }
})();
