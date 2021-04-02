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
        };
    },
};
