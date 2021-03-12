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
<<<<<<< HEAD
            if (users.integrity.status) {
                const isSuccessful = await textContact(users.integrity);
                isSuccessful ? (users.integrity.status = true) : (users.integrity.status = false);
            }
            if (users.allArea.status) {
                const isSuccessful = await textContact(users.allArea);
                isSuccessful ? (users.allArea.status = true) : (users.allArea.status = false);
            }
            if (users.guardian.status) {
                const isSuccessful = await textContact(users.guardian);
                isSuccessful ? (users.guardian.status = true) : (users.guardian.status = false);
            }
            // if (users.titan.status) {
            //     const isSuccessful = await textContact(users.titan);
            //     isSuccessful ? (users.titan.status = true) : (users.titan.status = false);
            // }

            // users.customInstallations.status && (await runCampaign(users.customInstallations));
=======
>>>>>>> update

            await minutesWait(2);
        }
    } catch (error) {
        console.log(error);
    }
})();
