const highLevel = require("./src/highLevel");
const { minutesWait, mapContact } = require("./src/helpers");
const { getRecord, updateRecord } = require("./src/airtable");

const numContacts = 50;

const textContact = async () => {
    try {
        const record = await getRecord();
        const contact = mapContact(record);
        await highLevel(contact);
        await updateRecord(record.id);

        console.log("Texted", contact.name);
    } catch (error) {
        console.log("ERROR TEXTING CONTACT ---", error);
    }
};

(async () => {
    try {
        for (let i = 0; i < numContacts; i++) {
            await textContact();
            await minutesWait(3);
        }
    } catch (error) {
        console.log(error);
    }
})();
