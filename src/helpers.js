module.exports = {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    },

    liveCampaigns(campaigns) {
        return campaigns.filter((campaign) => {
            if ("Campaign Status" in campaign) {
                if (campaign["Campaign Status"] === "Live") {
                    return campaign;
                }
            }
        });
    },

    campaignsToRun(campaigns) {
        let textCampaigns = [];

        campaigns.forEach((campaign) => {
            // check if client is in textCampaigns
            const isClientPresent = textCampaigns.some(
                (newCampaign) => newCampaign.client === campaign.client
            );

            if ("type" in campaign && campaign.type === "Specific") {
                return textCampaigns.push(campaign);
            }

            // check if multiple same clients exist in campaigns
            const clientCampaigns = campaigns.filter((obj) => {
                if (!("type" in obj)) {
                    return obj.client === campaign.client;
                }
            });

            if (clientCampaigns.length > 1 && !isClientPresent) {
                let clientAdded = false;

                clientCampaigns.some((obj) => {
                    if (!("Last Updated" in obj)) {
                        clientAdded = true;
                        return textCampaigns.push(obj);
                    }
                });

                const [nextCampaign] = clientCampaigns.sort(
                    (a, b) => new Date(a["Last Updated"]) - new Date(b["Last Updated"])
                );

                !clientAdded && textCampaigns.push(nextCampaign);
            }

            if (clientCampaigns.length === 1) {
                textCampaigns.push(campaign);
            }
        });

        return textCampaigns;
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
