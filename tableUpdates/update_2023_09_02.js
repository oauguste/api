const db = require("../db/db");

let addCategorySql = `ALTER TABLE posts ADD COLUMN category TEXT`;
db.run(addCategorySql, (err) => {
  if (err) {
    console.error("Failed to add category column:", err);
    return;
  }
  console.log("Category column added successfully.");
});
