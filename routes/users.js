/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const apiKEY = process.env.API_KEY;


module.exports = (db) => {
  router.get("/api/users", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({
          users
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });
  });


  //================================ LOGIN =================================//

  const getUserWithEmail = function (email) {
    return db.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
      .then(res => res.rows[0])
      .catch((error) => {
        console.log(error);
      });
  };
  const login =  function(email, password) {
    return getUserWithEmail(email)
    .then(user => {
      if (password === user.password) {
        return user;
      }
      return null;
    });
  };
  // POST -- LOGIN
  router.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    login(email , password)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      } // req.session.userId = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: err.message
        });
    });

  });
  // GET -- LOGIN
  router.get("/login", (req, res) => {
    res.render('login');
  });


  //============================== REGISTER ===============================//
  router.get("/register", (req, res) => {
    res.render("register");
  });
  const createNewUser = function (name, email, password, defaultCity, preferences) {
    return db.query(`
  INSERT INTO users (name, email, password, default_city, preferences)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;
  `, [name, email, password, defaultCity, preferences])
      .then(res => res.rows[0])
      .catch((error) => {
        console.log(error);
      });
  };
  /* REGISTER
  *   - post is made on /register page (user enter email and password)
  *   - getUserWithEmail is called with the input email
  *   - if a valid user is returned, that means the email was already in use
  *   - if null is returned, createNewUser is called with fake data
  *   - /api/users is called to show db table with newly added user
  */
  router.post("/register", (req, res) => {
    const name = 'testName';
    const defaultCity = 'testCity';
    const preferences = 'testPreferences';
    const email = req.body.username;
    const password = req.body.password;
    getUserWithEmail(email)
    .then(user => {
      if(user) {
        res.send('ALREADY EXISTS')
        return;
      }
      createNewUser(name, email, password, defaultCity, preferences)
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: err.message
        });
    });

  });
  router.get("/", (req, res) => {
    const templateVars = {
      key: apiKEY
    };
    res.render("index", templateVars);
  });

  return router;
};
