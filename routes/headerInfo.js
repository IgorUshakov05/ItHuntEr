const jwt = require("jsonwebtoken");

const header = (session) => {
    try {
        if (typeof session.access === 'string') {
            return { isLoggedIn: true, username: "Igor" };
        }

        if (typeof session?.passport?.user === 'number') {
            return { isLoggedIn: true, username: "Igor" };
        }

        return { isLoggedIn: false, username: "Igor" };
    } catch (e) {
        console.log(e);
        return { isLoggedIn: false, username: "Igor" };
    }
};

module.exports = { header };
