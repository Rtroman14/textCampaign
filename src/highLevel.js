require("dotenv").config();

const axios = require("axios");

module.exports = async (data) => {
    const config = {
        method: "post",
        url: "https://rest.gohighlevel.com/v1/contacts/",
        headers: {
            Authorization: `Bearer ${process.env.HIGHLEVEL_KEY}`,
        },
        data: data,
    };

    return await axios(config);
};
