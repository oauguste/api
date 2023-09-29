const db = require("../db/db");

let addImagesSql = `ALTER TABLE posts ADD COLUMN image_path TEXT`;
db.run(addImagesSql, (err) => {
  if (err) {
    console.error("Failed to add Image_path column:", err);
    return;
  }
  console.log("Image_path column added successfully.");
});
