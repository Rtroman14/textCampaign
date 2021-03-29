const textContact = require("./textContact");
const users = require("../config/keys");

module.exports = {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    },

    filterCampaigns(campaigns) {
        return campaigns.filter((campaign) => {
            if ("Campaign Status" in campaign) {
                if (campaign["Campaign Status"] === "Live") {
                    return campaign;
                }
            }
        });
    },

    mapContact(contact) {
        return {
            firstName: contact["First Name"] || "",
            lastName: contact["Last Name"] || "",
            name: `${contact["First Name"]} ${contact["Last Name"]}`,
            email: contact.Email || "",
            phone: contact["Phone Number"] || "",
            address1: contact.Address || "",
            city: contact.City || "",
            state: contact.State || "",
            postalCode: contact["Zip Code"] || "",
            tags: contact.Tag,
        };
    },

    async runCampaign(client) {
        if (users[client].status) {
            const isCampaignSuccessful = await textContact(users[client]);
            users[client].status = isCampaignSuccessful;
        }
    },
};
