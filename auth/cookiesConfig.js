const db = require("../db/db");
const {
  getUserByEmail,
} = require("../utilities/utilities");

module.exports = function (passport) {
  console.log(
    "Inside cookiesConfig.js. Passport is:",
    passport
  );

  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(async function (email, done) {
    try {
      const user = await getUserByEmail(email, db, "users");
      done(null, user);
    } catch (error) {
      console.error(`Failed to deserialize user: ${error}`);
      done(error);
    }
  });
};
