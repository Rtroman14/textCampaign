module.exports = {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    },

    mapContact(contact) {
        return {
            firstName: contact["First Name"],
            lastName: contact["Last Name"],
            name: `${contact["First Name"]} ${contact["Last Name"]}`,
            email: contact.Email,
            phone: contact["Cell Phone"],
            address1: contact.Address,
            city: contact.City,
            state: contact.State,
            postalCode: contact["Zip Code"],
            tags: contact.Tag,
        };
    },
};
