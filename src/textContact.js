const highLevel = require("./highLevel");
const { mapContact } = require("./helpers");
const { getRecord, updateRecord } = require("./airtable");

let record;

module.exports = async (client) => {
    try {
        record = await getRecord(client);
        const contact = mapContact(record);

        // add to highLevel / text contact
        const texted = await highLevel(client.highlevelKey, contact);

        // if successful, update record
        if (texted.status == "200") {
            // update in airtable
            await updateRecord(client, "In High Level", record.id);
            console.log(`${client.client} texted: ${contact.name}`);
            return true;
        }
    } catch (error) {
        await updateRecord(client, "Error", record.id);
        console.log(`ERROR TEXTING CONTACT --- ${client.client} --- ${error.message}`);
        return false;
    }
};

// landlord complaint - colorado housing connects - 844 926 6632
// https://coloradohousingconnects.org/contact/
