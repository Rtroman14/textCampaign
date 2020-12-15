const users = require("./config/keys");
const textContact = require("./src/textContact");
const { minutesWait } = require("./src/helpers");

const numContacts = 50;

(async () => {
    const status = {
        customInstallations: true,
        priorityRoofing: true,
        priorityRoofingBenton: true,
    };

    try {
        for (let i = 0; i < numContacts; i++) {
            if (status.customInstallations) {
                const isSuccessful = await textContact(users.customInstallations);
                isSuccessful
                    ? (status.customInstallations = true)
                    : (status.customInstallations = false);
            }
            await minutesWait(3);
        }
    } catch (error) {
        console.log(error);
    }
})();
