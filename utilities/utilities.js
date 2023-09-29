const db = require("../db/db");

async function deleteRecordById(id, db, table) {
  // Validate table name if necessary
  const validTables = ["users", "posts", "messages"]; // Add table names that are allowed
  if (!validTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM ${table} WHERE id = ?`,
      [id],
      function (err) {
        // Use function keyword to access `this.changes`
        if (err) {
          console.error(`Failed to delete record: ${err}`);
          return reject(err);
        }
        if (this.changes === 0) {
          return reject(
            new Error(`No record found with id ${id}`)
          );
        }
        resolve();
      }
    );
  });
}
async function getAllRecords(db, table) {
  const validTables = ["users", "posts", "messages"];
  if (!validTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${table}`, (err, rows) => {
      if (err) {
        console.error(`Failed to get records: ${err}`);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}
async function getRecordById(id, db, table) {
  // Validate table name if necessary
  const validTables = ["users", "posts", "messages"]; // Add table names that are allowed
  if (!validTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM ${table} WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error(
            `Failed to get record by ID: ${err}`
          );
          reject(err);
        }

        if (row) {
          row.url = `/${table.slice(0, -1)}/${row.id}`;
        }

        resolve(row);
      }
    );
  });
}
async function getUserByEmail(email, db, table) {
  const validateTable = ["users"];
  if (!validateTable.includes(table)) {
    throw new Error("Invalid table name");
  }
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM ${table} WHERE email =?`,
      [email],
      (err, row) => {
        if (err) {
          console.error(
            `This email does not exist: ${err}`
          );
          reject(err);
        }

        resolve(row);
      }
    );
  });
}
async function getPostsByCategory(
  category,
  db,
  table = "posts"
) {
  const validateTable = ["posts"];
  if (!validateTable.includes(table)) {
    throw new Error("Invalid table name");
  }

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM ${table} WHERE category = ?`,
      [category],
      (err, rows) => {
        if (err) {
          console.error(
            `Error fetching posts by category: ${err}`
          );
          reject(err);
        }

        if (rows.length === 0) {
          console.error(
            `No posts found for category: ${category}`
          );
          reject(
            new Error(
              `No posts found for category: ${category}`
            )
          );
        }

        resolve(rows);
      }
    );
  });
}

async function insertRecord(table, cols, values) {
  const validTables = ["users", "posts", "messages"]; // Add table names that are allowed
  if (!validTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  // Create a string of question marks separated by commas,
  // which will serve as placeholders for the values.
  const placeholders = values.map(() => "?").join(", ");

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ${table} (${cols}) VALUES(${placeholders})`,
      values,
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        // this.lastID contains the id of the last inserted row
        resolve(this.lastID);
      }
    );
  });
}

async function updateData(id, data, col, table) {
  const validateTable = ["posts"];
  if (!validateTable.includes(table)) {
    throw new Error("Invalid table name");
  }
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE INTO ${table} (${col}) WHERE id =?`,
      [data, id],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error("No row found to update"));
          return;
        }
        resolve(id);
      }
    );
  });
}
async function updateRecordById(id, newData, db, table) {
  // Validate table name if necessary
  const validTables = ["users", "posts", "messages"]; // Add table names that are allowed
  if (!validTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  const keys = Object.keys(newData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(newData);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE ${table} SET ${keys} WHERE id = ?`,
      [...values, id],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes); // returns the number of rows updated
      }
    );
  });
}
module.exports = {
  updateRecordById,
  insertRecord,
  updateData,
  getUserByEmail,
  getPostsByCategory,
  getRecordById,
  deleteRecordById,
  getAllRecords,
};
