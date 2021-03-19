const clients = require("./config/keys");
const textContact = require("./src/textContact");
const { minutesWait } = require("./src/helpers");

const numContacts = 50;

(async () => {
    try {
        for (let i = 0; i < numContacts; i++) {
            for (let client of clients) {
                if (client.status) {
                    const isSuccessful = await textContact(client);
                    isSuccessful ? (client.status = true) : (client.status = false);
                }
            }

            await minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
