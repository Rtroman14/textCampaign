const users = require("./config/keys");
const textContact = require("./src/textContact");
const { minutesWait } = require("./src/helpers");

const numContacts = 50;

(async () => {
    try {
        for (let i = 0; i < numContacts; i++) {
            for (let user of users) {
                if (user.status) {
                    const isSuccessful = await textContact(user);
                    isSuccessful ? (user.status = true) : (user.status = false);
                }
            }

            await minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
