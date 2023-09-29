// ./auth/passport.js

module.exports = function (passport) {
  // Session Handling (Serialize and Deserialize)
  console.log("Before requiring cookiesConfig");
  require("./cookiesConfig")(passport);

  console.log("After requiring cookiesConfig");
  // Local Strategy
  require("./passportConfig")(passport);

  // JWT Strategy
  require("./passportJwt")(passport);
};
