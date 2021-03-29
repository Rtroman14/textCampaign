const Airtable = require("airtable");
const moment = require("moment");

module.exports = class AirtableApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async assignAirtable(baseID) {
        try {
            return new Airtable({ apiKey: this.apiKey }).base(baseID);
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    async getCampaigns() {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            const res = await base("Campaigns").select({ view: "Text" }).firstPage();

            const campaigns = res.map((campaign) => {
                return {
                    ...campaign.fields,
                    recordID: campaign.getId(),
                };
            });

            return campaigns;
        } catch (error) {
            console.log("ERROR GETCAMPAIGNS() ---", error);
        }
    }

    async updateCampaign(recordID, updatedFields) {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            await base("Campaigns").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECAMPAIGN() ---", error);
        }
    }

    async getContact(baseID, baseName) {
        try {
            const base = await this.assignAirtable(baseID);

            const res = await base(baseName).select({ maxRecords: 1, view: "Text" }).firstPage();

            return res.length > 0 ? res[0].fields : false;
        } catch (error) {
            console.log("ERROR GETCONTACT() ---", error);
        }
    }

    async updateContact(baseID, baseName, recordID, updatedFields) {
        try {
            const base = await this.assignAirtable(baseID);

            await base(baseName).update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECONTACT() ---", error);
        }
    }
};
