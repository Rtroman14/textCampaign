const Airtable = require("airtable");

module.exports = {
    async getRecord(client) {
        const base = new Airtable({ apiKey: client.AIRTABLE_API_KEY }).base("appc1d7xJdOe2bCnD");
        const table = base(client.baseName);

        const record = await table.select({ maxRecords: 1, view: "Add To HighLevel" }).firstPage();
        return { ...record[0].fields, id: record[0].id };
    },

    async updateRecord(client, view, id) {
        const base = new Airtable({ apiKey: client.AIRTABLE_API_KEY }).base("appc1d7xJdOe2bCnD");
        const table = base(client.baseName);

        await table.update(id, { [view]: true });
    },
};
