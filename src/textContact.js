const highLevel = require("./highLevel");
const { mapContact } = require("./helpers");
const { getRecord, updateRecord } = require("./airtable");

module.exports = async (client) => {
    try {
        const record = await getRecord(client);
        const contact = mapContact(record);

        // add to highLevel / text contact
        const texted = await highLevel(client.HIGHLEVEL_TOKEN, contact);

        // if successful, update record
        if (texted.status == "200") {
            // update in airtable
            await updateRecord(client, "In High Level", record.id);
            console.log("Texted", contact.name);
            return true;
        } else {
            await updateRecord(client, "Error", record.id);
            console.log("Error texting", contact.name);
            return false;
        }
    } catch (error) {
        console.log("ERROR TEXTING CONTACT ---", error);
        return false;
    }
};
