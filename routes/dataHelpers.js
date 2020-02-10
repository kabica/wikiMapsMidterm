const db = require('../server.js')


// Get a single user from the database given their email.
const getUserWithEmail = function (email) {
  return db.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
    .then(res => res.rows[0])
    .catch((error) => {
      console.log(error);
    });
}
exports.getUserWithEmail = getUserWithEmail;

// Add a new user to the database.
const addUser = function (user) {
  return db.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch((error) => {
      console.log(error);
    });
}
exports.addUser = addUser;









const test = function() {
  return db.query(`
  SELECT * FROM users;
  `)
    .then(res => res.rows[0])
    .catch((error) => {
      console.log(error);
    });
}

exports.test = test;
