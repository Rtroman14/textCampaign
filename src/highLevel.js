const axios = require("axios");

module.exports = async (token, data) => {
    const config = {
        method: "post",
        url: "https://rest.gohighlevel.com/v1/contacts/",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data,
    };

    return await axios(config);
};
