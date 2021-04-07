require("dotenv").config();

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const { mapContact, liveCampaigns } = require("./src/helpers");

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();

        let campaigns = liveCampaigns(getCampaigns);
    } catch (error) {
        console.log(error.message);
    }
})();
