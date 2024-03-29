require("dotenv").config();

const axios = require("axios");

module.exports = class Highlevel {
    constructor(token) {
        this.token = token;
    }

    getConfig(method, url, data) {
        try {
            if (data) {
                return {
                    method,
                    url,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                    data,
                };
            }
            return {
                method,
                url,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            };
        } catch (error) {
            console.log("ERROR CONFIG ---", error);
        }
    }

    async createContact(data) {
        try {
            const config = this.getConfig(
                "post",
                "https://rest.gohighlevel.com/v1/contacts/",
                data
            );

            const res = await axios(config);

            return res.data.contact;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }

    async addToCampaign(contactID, campaignID) {
        try {
            const config = this.getConfig(
                "post",
                `https://rest.gohighlevel.com/v1/contacts/${contactID}/campaigns/${campaignID}`
            );

            const res = await axios(config);
            return res;
        } catch (error) {
            console.log("ERROR ADDTOCAMPAIGN ---", error.message);
        }
    }

    async textContact(contactData, campaignID) {
        try {
            const contact = await this.createContact(contactData);

            const res = await this.addToCampaign(contact.id, campaignID);

            return { ...contact, ...res };
        } catch (error) {
            console.log("ERROR TEXTCONTACT ---", error.message);
        }
    }
};
