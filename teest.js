const { minutesWait } = require("./src/helpers");

(async () => {
    for (let i = 0; i < 5; i++) {
        console.log("Run");

        await minutesWait(0.1);
    }
})();
