const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {
  getUserByEmail,
} = require("../utilities/utilities");
const db = require("../db/db");
const passport = require("passport");

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest =
    ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET; // TODO: Replace with environment variable

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log("JWT Strategy triggered", jwt_payload);

      try {
        // Assuming your JWT has an email field. Adjust as needed.
        const user = await getUserByEmail(
          jwt_payload.email,
          db,
          "users"
        );

        if (user) {
          return done(null, { ...user, id: user.id });
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
