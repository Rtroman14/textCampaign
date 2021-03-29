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

    async getContacts() {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            const res = await base("Campaigns").select({ view: "Text" }).firstPage();

            const contacts = res.map((contact) => {
                return {
                    ...contact.fields,
                    recordID: contact.getId(),
                };
            });

            return contacts;
        } catch (error) {
            console.log("ERROR GETCONTACTS() ---", error);
        }
    }

    async updateContact(baseID, recordID, updatedFields) {
        try {
            const base = await this.assignAirtable(baseID);

            await base("First Line Ready").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECONTACTS() ---", error);
        }
    }
};
