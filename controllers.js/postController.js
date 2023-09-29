const express = require("express");
const asyncHandler = require("express-async-handler");
const db = require("../db/db");
const {
  getRecordById,
  getAllRecords,
  getPostsByCategory,
} = require("../utilities/utilities");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("Site homepage not yet implemented");
});

exports.view_all_posts = asyncHandler(
  async (req, res, next) => {
    try {
      const posts = await getAllRecords(db, "posts");

      if (posts.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "No posts found",
        });
      }

      res.status(200).json({
        status: 200,
        success: true,
        posts: posts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }
);

exports.view_post_detail = asyncHandler(
  async (req, res, next) => {
    try {
      const postId = req.params.id;
      const post = await getRecordById(postId, db, "posts");

      if (!post) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Post not found",
        });
      }

      res.status(200).json({
        status: 200,
        success: true,
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }
);
exports.view_all_posts_in_category = asyncHandler(
  async (req, res, next) => {
    try {
      const category = req.params.category; // Assuming the category is a URL parameter like /posts/category/:category
      const posts = await getPostsByCategory(
        category,
        db,
        "posts"
      ); // "posts" is hardcoded because you're always querying the posts table

      res.status(200).json({
        status: 200,
        success: true,
        posts: posts,
      });
    } catch (error) {
      // If error is due to no posts being found, return a 404. Otherwise, return a 500.
      const statusCode = error.message.includes(
        "No posts found"
      )
        ? 404
        : 500;
      const message = error.message.includes(
        "No posts found"
      )
        ? "No posts found"
        : "Internal server error";

      res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: message,
      });
    }
  }
);
