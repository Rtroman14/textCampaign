const moment = require("moment");
const today = moment(new Date()).format("YYYY-MM-DD");

module.exports = {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    },

    liveCampaigns(campaigns) {
        return campaigns.filter((campaign) => {
            if (
                "Campaign Status" in campaign &&
                "Base ID" in campaign &&
                "API Token" in campaign &&
                "Campaign ID" in campaign
            ) {
                if (
                    campaign["Campaign Status"] === "Live" ||
                    campaign["Campaign Status"] === "Need More Contacts"
                ) {
                    return campaign;
                }
            }
        });
    },

    campaignsDueToday(campaigns) {
        return campaigns.filter((campaign) => {
            if (!("Last Updated" in campaign)) {
                return campaign;
            }

            if ("Last Updated" in campaign && moment(campaign["Last Updated"]).isBefore(today)) {
                return campaign;
            }
        });
    },

    campaignsToRun(campaigns) {
        let textCampaigns = [];

        campaigns.forEach((campaign) => {
            // check if client is in textCampaigns
            const isClientPresent = textCampaigns.some(
                (newCampaign) => newCampaign.Client === campaign.Client
            );

            if ("Type" in campaign && campaign.Type === "Specific") {
                return textCampaigns.push(campaign);
            }

            // check if multiple same clients exist in campaigns
            const clientCampaigns = campaigns.filter((obj) => {
                if (!("Type" in obj)) {
                    return obj.Client === campaign.Client;
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

    campaignsToRunTest(campaigns) {
        let allLiveCampaigns = liveCampaigns(campaigns);
        // let todayCampaigns = this.campaignsDueToday(liveCampaigns);

        let accounts = [];

        allLiveCampaigns.forEach((liveCampaign) => {
            const liveAccount = liveCampaign.Account;

            let accountIndex;

            const foundAccount = accounts.find((el, index) => {
                accountIndex = index;
                return el.Account === liveAccount;
            });

            if (foundAccount) {
                accounts[accountIndex].push(foundAccount);
            }

            return accounts.push(liveCampaign);
        });

        // get all campaigns
        // create array of array of campaigns by "Account"
        // filter out campaigns that don't have all fields
        // create array of arrays based on "Account"
    },

    mapContact(contact) {
        return {
            firstName: contact["First Name"] || "",
            lastName: contact["Last Name"] || "",
            name: `${contact["First Name"]} ${contact["Last Name"]}`,
            email: contact.Email || "",
            phone: contact["Phone Number"] || "",
            address1: contact.Street || "",
            city: contact.City || "",
            state: contact.State || "",
            postalCode: contact.Zip || "",
        };
    },
};
