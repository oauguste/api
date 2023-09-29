const express = require("express");
const router = express.Router();
const postcontroller = require("../controllers.js/postController");
const usercontroller = require("../controllers.js/userController");
const passport = require("passport");
const { route } = require("../app");
const upload = require("../imageHandling/multerConfig");

//User Routes

//Get home page
router.get("/", postcontroller.index);
//JWT formatted routed below

/*app.get('/some-protected-route', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('If you can see this, you are authenticated');
});

*/

//View user

router.get(
  "/user/:id",
  usercontroller.user_view_user_detail
);

//Get request for User signup

router.get("/signup", usercontroller.user_signup_get);

//Post request for User signup
router.post("/signup", usercontroller.user_signup_post);

//Get request for User login
router.get("/login", usercontroller.user_login_get);

//Post request for User login
router.post(
  "/login",

  usercontroller.user_login_post
);

//Get request for User LogOut
router.get("/logout", usercontroller.user_logout_get);

//Post request for User LogOut
router.post("/logout", usercontroller.user_logout_post);

//Get request for User Create
router.get(
  "/post/create",
  usercontroller.user_create_post_get
);
//Post request for User Create
router.post(
  "/post/create",

  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }),
  upload.single("picture"),
  // usercontroller.user_login_submitPicture_post,
  // usercontroller.isUserAuthorized,
  usercontroller.user_create_post_post
);
//Get request for User Update
router.get(
  "/post/:id/update",
  usercontroller.user_update_post_get
);
//Post request for User Update
router.post(
  "/post/:id/update",
  usercontroller.user_update_post_post
);
//Get request for User Delete
router.get(
  "/post/:id/delete",
  usercontroller.user_delete_post_get
);
//Post request for User Delete
router.post(
  "/post/:id/delete",
  usercontroller.user_delete_post_post
);

/* router.post(
  "/post/:id/delete",
  passport.authenticate("jwt", { session: false }), // Authenticate user with JWT
  usercontroller.isUserAuthorized,  // Custom middleware to check if user is authorized
  usercontroller.user_delete_post_post
);  TEMPLATE TO USE WITH AUTHEN, AUTHORI */

//Post Routes

//view all posts
router.get("/posts", postcontroller.view_all_posts);

//view single post
router.get("/posts/:id", postcontroller.view_post_detail);

//view post by category
router.get(
  "./posts/category/:id",
  postcontroller.view_all_posts_in_category
);
module.exports = router;
