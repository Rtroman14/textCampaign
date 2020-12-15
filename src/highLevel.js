require("dotenv").config();

const axios = require("axios");

module.exports = async (data) => {
    let result;

    const config = {
        method: "post",
        url: "https://rest.gohighlevel.com/v1/contacts/",
        headers: {
            Authorization: `Bearer ${process.env.HIGHLEVEL_KEY}`,
        },
        data: data,
    };

    // axios(config)
    //     .then((response) => {
    //         // console.log(JSON.stringify(response.data));
    //         // console.log(response);
    //         result = true;
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         result = false;
    //     });

    return await axios(config);

    // return result;
};
