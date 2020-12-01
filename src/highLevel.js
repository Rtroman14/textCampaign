const axios = require("axios");

module.exports = async (data) => {
    let result = false;

    const config = {
        method: "post",
        url: "https://rest.gohighlevel.com/v1/contacts/",
        headers: {
            Authorization: "Bearer baae7f61-59c1-493c-99f6-c2431352aaab",
        },
        data: data,
    };

    axios(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
            result = true;
        })
        .catch((error) => {
            console.log(error);
            result = false;
        });

    return result;
};
