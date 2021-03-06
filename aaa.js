const { campaignsToRun } = require("./src/helpers");

// get campaigns
let campaigns = [
    { Client: "Hornet", "Last Updated": "4/6/2021", Type: "Specific" },
    { Client: "Hornet", "Last Updated": "4/6/2021", Type: "Specific" },
    { Client: "Farha", "Last Updated": "4/6/2021" },
    { Client: "Farha", "Last Updated": "4/4/2021" },
    { Client: "Integrity", "Last Updated": "4/6/2021" },
    { Client: "Just Roofs", "Last Updated": "4/6/2021" },
    { Client: "Just Roofs" },
    { Client: "New Age", "Last Updated": "4/6/2021" },
];

const test = campaignsToRun(campaigns);

console.log(test);

// const sortDate = (obj) =>
//     obj.sort((a, b) => new Date(a["Last Updated"]) - new Date(b["Last Updated"]));

// let newCampaigns = [];

// campaigns.forEach((campaign) => {
//     // check if client is in newCampaigns
//     const isClientPresent = newCampaigns.some(
//         (newCampaign) => newCampaign.client === campaign.client
//     );

//     if ("type" in campaign && campaign.type === "Specific") {
//         return newCampaigns.push(campaign);
//     }

//     // check if multiple same clients exist in campaigns
//     const clientCampaigns = campaigns.filter((obj) => {
//         if (!("type" in obj)) {
//             return obj.client === campaign.client;
//         }
//     });

//     if (clientCampaigns.length > 1 && !isClientPresent) {
//         let clientAdded = false;

//         clientCampaigns.some((obj) => {
//             if (!("Last Updated" in obj)) {
//                 clientAdded = true;
//                 return newCampaigns.push(obj);
//             }
//         });

//         const [nextCampaign] = sortDate(clientCampaigns);

//         !clientAdded && newCampaigns.push(nextCampaign);
//     }

//     if (clientCampaigns.length === 1) {
//         newCampaigns.push(campaign);
//     }
// });

// console.log(newCampaigns);
