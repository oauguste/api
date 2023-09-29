const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");
const db = require("../db/db");
const {
  getUserByEmail,
} = require("../utilities/utilities");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await getUserByEmail(
            email,
            db,
            "users"
          );
          if (!user) {
            return done(null, false, {
              message: "User not found",
            });
          }

          const isMatch = await bcrypt.compare(
            password,
            user.password
          );
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect password",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
