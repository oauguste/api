const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database(
  "./blogDb.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Connected to the database.");
  }
);

// Populate users table
db.serialize(() => {
  let stmt = db.prepare(
    `INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?, ?)`
  );

  stmt.run(
    "John",
    "Doe",
    "john.doe@example.com",
    "johnpassword",
    0
  );
  stmt.run(
    "Jane",
    "Doe",
    "jane.doe@example.com",
    "janepassword",
    0
  );
  stmt.run(
    "Alice",
    "Smith",
    "alice.smith@example.com",
    "alicepassword",
    0
  );
  stmt.run(
    "Bob",
    "Johnson",
    "bob.johnson@example.com",
    "bobpassword",
    0
  );
  stmt.run(
    "Charlie",
    "Brown",
    "charlie.brown@example.com",
    "charliepassword",
    0
  );

  stmt.finalize();
});

// Populate posts table
db.serialize(() => {
  let stmt = db.prepare(
    `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`
  );

  stmt.run(
    1,
    "First Post",
    "This is the content of the first post."
  );
  stmt.run(
    2,
    "Second Post",
    "This is the content of the second post."
  );
  stmt.run(
    1,
    "Another Post",
    "This is yet another post by John."
  );
  stmt.run(3, "Alice's Post", "This is a post by Alice.");
  stmt.run(4, "Bob's Take", "This is what Bob thinks.");

  stmt.finalize();
});

// Populate messages table
db.serialize(() => {
  let stmt = db.prepare(
    `INSERT INTO messages (user_id, post_id, message) VALUES (?, ?, ?)`
  );

  stmt.run(1, 1, "Great post!");
  stmt.run(2, 1, "I think this could be improved.");
  stmt.run(3, 2, "Interesting perspective.");
  stmt.run(4, 2, "Not sure if I agree.");
  stmt.run(5, 1, "Thanks for sharing!");

  stmt.finalize();
});

db.close((err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Closed the database connection.");
});
