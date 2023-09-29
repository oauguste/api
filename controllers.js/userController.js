const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const {
  getRecordById,
  deleteRecordById,
  updateRecordById,
  insertRecord,
  getUserByEmail,
  updateData,
} = require("../utilities/utilities");

const {
  body,
  validationResult,
} = require("express-validator");

const { promisify } = require("util");
const hashAsync = promisify(bcrypt.hash);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Utility function for sending JSON responses
const sendJSONResponse = (
  res,
  status,
  success,
  message,
  data = null
) => {
  const response = { status, success, message };
  if (data) response.data = data;
  res.status(status).json(response);
};

exports.isUserAuthorized = async (req, res, next) => {
  // If the user is an admin, they are authorized to perform any action
  // if (req.user && req.user.is_admin) {
  //   return next();
  // }

  // If the user is trying to perform an action on a post
  if (req.user) {
    try {
      // Fetch the post from the database
      const post = await getRecordById(
        req.user.id,
        db,
        "posts"
      ); // Replace with your actual database fetching logic
      const message = await getRecordById(
        req.user.id,
        db,
        "messages"
      ); // Replace with your actual database fetching logic
      // If the user is the owner of the post, they are authorized to perform the action
      if (post && post.id === req.user.id) {
        return next();
      }
    } catch (err) {
      // Handle errors (e.g., database errors)
      return res.status(500).send("Internal Server Error");
    }
  }

  // If the user is trying to perform an action on their own profile
  if (req.user && req.user.id === req.params.userId) {
    return next();
  }

  // If the user is not authorized to perform the action, return a 403 Forbidden status
  return res.status(403).json({
    status: 404,
    success: false,
    message: "User is unauthorized to perform this action!",
  });
};
exports.user_view_user_detail = asyncHandler(
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await getRecordById(userId, db, "users");
      if (!user) {
        return sendJSONResponse(
          res,
          404,
          false,
          "User not found"
        );
      }
      sendJSONResponse(res, 200, true, "Success", user);
    } catch (error) {
      return sendJSONResponse(
        res,
        500,
        false,
        "Internal Server Error",
        { error: error.message }
      );
    }
  }
);

exports.user_signup_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_login_get not yet implemented");
  }
);

exports.user_signup_post = asyncHandler(
  async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } =
        req.body;

      // Perform validation here (this is just an example)
      if (
        !first_name ||
        !last_name ||
        !email ||
        !password
      ) {
        return sendJSONResponse(
          res,
          400,
          false,
          "All fields are required"
        );
      }
      const existingUser = await getUserByEmail(
        email,
        db,
        "users"
      );
      if (existingUser) {
        return sendJSONResponse(
          res,
          400,
          false,
          "Email already in use"
        );
      }
      const hashedPassword = await hashAsync(password, 10);

      const columns =
        "first_name, last_name, email, password";
      const values = [
        first_name,
        last_name,
        email,
        hashedPassword,
      ];

      const lastID = await insertRecord(
        "users",
        columns,
        values
      );

      return sendJSONResponse(
        res,
        201,
        true,
        "User successfully created",
        { lastID }
      );
    } catch (error) {
      console.error(error.message);
      return sendJSONResponse(
        res,
        500,
        false,
        "Internal Server Error",
        { error: error.message }
      );
    }
  }
);

exports.user_login_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_login_get not yet implemented");
  }
);
exports.user_login_submitPicture_post = asyncHandler(
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(404).json({
          status: 404,
          success: false,
          message: "Error with image submition",
        });
      }
      const id = req.params.id;
      const post = await getRecordById(id, db, "Posts");
      if (!post) {
        res.status(404).json({
          status: 404,
          success: false,
          message: "Post not found",
        });
      }
      await updateData(
        id,
        `../images/${req.file.filename}`,
        "posts"
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Image updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Network error",
      });
    }
  }
);

exports.user_login_post = asyncHandler(
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate the email and password, typically by looking up the user in your DB
      // and then comparing the hashed password.

      const user = await getUserByEmail(email, db, "users"); // Replace with your actual DB lookup
      const match = await bcrypt.compare(
        password,
        user.password
      );

      if (!match) {
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      // Create JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET, //TODO: place key in a ENV
        {
          expiresIn: "1h",
        }
      );

      res.json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred" });
    }
  }
);

exports.user_logout_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_logout_get not yet implemented");
  }
);
exports.user_logout_post = asyncHandler(
  async (req, res, next) => {
    // Perform any server-side cleanup or logging if necessary
    // ...

    // Send a success response
    res.status(200).json({
      status: 200,
      success: true,
      message: "Logged out successfully",
    });
  }
);

exports.user_create_post_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_create_post_get  not yet implemented");
  }
);
exports.validatePostFields = [
  body("user_id")
    .trim()
    .isInt()
    .withMessage("User ID should be an integer"),
  body("title")
    .trim()
    .isInt()
    .withMessage("Post ID should be an integer"),
  body("content")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Message should not be empty"),
  body("category")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Message should not be empty"),
];

exports.user_create_post_post = asyncHandler(
  async (req, res, next) => {
    console.log("req.user:", req.user);

    // Validation

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const { title, content, category } = req.body;

      // Authorization
      if (req.user) {
        console.log(req.body);
        const user_id = req.user.id;
        const insertedId = await insertRecord(
          "posts",
          "user_id, title, content, category",
          [user_id, title, content, category]
        );

        return sendJSONResponse(
          res,
          200,
          true,
          "Post successfully created",
          { insertedId }
        );
      } else {
        return sendJSONResponse(
          res,
          401,
          false,
          "Unauthorized",
          {
            error:
              "You can't create a post for another user",
          }
        );
      }
    } catch (error) {
      return sendJSONResponse(
        res,
        500,
        false,
        "Internal Server Error",
        { error: error.message }
      );
    }
  }
);
exports.user_update_post_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_update_post_get not yet implemented");
  }
);
exports.user_update_post_post = asyncHandler(
  async (req, res, next) => {
    try {
      const postId = req.params.id;
      const { title, content, category, image_path } =
        req.body;
      const rowsChanged = await updateRecordById(
        postId,
        { title, content, category, image_path },
        db,
        "posts"
      );
      if (rowsChanged === 0) {
        return sendJSONResponse(
          res,
          404,
          false,
          "Post not found"
        );
      }
      return sendJSONResponse(
        res,
        200,
        true,
        "Post successfully updated"
      );
    } catch (error) {
      return sendJSONResponse(
        res,
        500,
        false,
        "Internal Server Error",
        { error: error.message }
      );
    }
  }
);

exports.user_delete_post_get = asyncHandler(
  async (req, res, next) => {
    res.send("user_delete_post_get  not yet implemented");
  }
);
exports.user_delete_post_post = asyncHandler(
  async (req, res, next) => {
    try {
      const postId = req.params.id;
      const postInfo = await getRecordById(
        postId,
        db,
        "posts"
      );

      if (!postInfo) {
        return sendJSONResponse(
          res,
          404,
          false,
          "post not found"
        );
      }
      await deleteRecordById(postId, db, "posts");
      return sendJSONResponse(
        res,
        200,
        true,
        "Post successfully deleted"
      );
    } catch (error) {
      return sendJSONResponse(
        res,
        500,
        false,
        "Internal Server Error",
        { error: error.message }
      );
    }
  }
);
