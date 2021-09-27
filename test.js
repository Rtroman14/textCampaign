require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");

const HelpersApi = require("./src/Helpers");
const Helpers = new HelpersApi();

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let accounts = Helpers.accountsToRun(getCampaigns);
        console.log(accounts);

        // const numContacts = 5;
        // // console.log(campaigns);
        // for (let i = 1; i < numContacts + 1; i++) {
        //     for (let campaign of campaigns) {
        //         let [runCampaign] = campaign;

        //         if (i === 2 && runCampaign.Account === "XL Roofing") {
        //             // remove campaign from list
        //             campaigns = campaigns.filter(
        //                 (currentCampaign) =>
        //                     currentCampaign.Campaign !== "XL Roofing - Austin Hail Campaign #1"
        //             );
        //         }

        //         console.log(runCampaign);
        //     }
        // }
    } catch (error) {
        console.log(error);
    }
})();

// let arr = [1, 2, 3, 4];

// for (let i = 0; i < 3; i++) {
//     for (let a of arr) {
//         if (i === 1) {
//             arr = arr.filter((currentCampaign) => currentCampaign !== 2);
//         }

//         console.log(a);
//     }
// }
