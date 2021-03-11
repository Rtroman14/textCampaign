const users = require("./config/keys");
const textContact = require("./src/textContact");
const { minutesWait } = require("./src/helpers");

const numContacts = 50;

(async () => {
    try {
        for (let i = 0; i < numContacts; i++) {
            // if (users.customInstallations.status) {
            //     const isSuccessful = await textContact(users.customInstallations);
            //     isSuccessful
            //         ? (users.customInstallations.status = true)
            //         : (users.customInstallations.status = false);
            // }
            // if (users.priorityRoofing.status) {
            //     const isSuccessful = await textContact(users.priorityRoofing);
            //     isSuccessful
            //         ? (users.priorityRoofing.status = true)
            //         : (users.priorityRoofing.status = false);
            // }
            // if (users.priorityRoofingBenton.status) {
            //     const isSuccessful = await textContact(users.priorityRoofingBenton);
            //     isSuccessful
            //         ? (users.priorityRoofingBenton.status = true)
            //         : (users.priorityRoofingBenton.status = false);
            // }
            if (users.hornet.status) {
                const isSuccessful = await textContact(users.hornet);
                isSuccessful ? (users.hornet.status = true) : (users.hornet.status = false);
            }
            if (users.integrity.status) {
                const isSuccessful = await textContact(users.integrity);
                isSuccessful ? (users.integrity.status = true) : (users.integrity.status = false);
            }
            // if (users.titan.status) {
            //     const isSuccessful = await textContact(users.titan);
            //     isSuccessful ? (users.titan.status = true) : (users.titan.status = false);
            // }

            // users.customInstallations.status && (await runCampaign(users.customInstallations));

            await minutesWait(3);
        }
    } catch (error) {
        console.log(error);
    }
})();
