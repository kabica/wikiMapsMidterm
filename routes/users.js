/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require('express');
const router = express.Router();
const apiKEY = process.env.API_KEY;
const chalk = require('chalk');


module.exports = (db) => {
  router.get("/alex", (req, res) => {
    let templateVars = {
      key: process.env.API_KEY,
      city: 'Calgary'
    }
    res.render('index', templateVars);
  });
  router.post("/alex", (req, res) => {
    let templateVars = {
      key: process.env.API_KEY,
      city: req.body.text
    }

    res.render('index', templateVars);
  });

  router.post('/endpoint', function(req, res) {
    console.log(chalk.magenta('body: ' + JSON.stringify(req.body)));
    req.body.forEach(marker => {
      console.log(marker);
    })
    console.log(req.body[0].marker0.lat);
    const userID = req.session.user_id;
  });

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
  const login = function (email, password) {
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
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({
            error: "error"
          });
          return;
        }
        req.session.userId = user.id;
        res.redirect(`/${email}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });

  });
  router.get("/:users", (req, res) => {
    email = req.params.users;
    db.query(`SELECT * FROM users WHERE email = '${email}'`)
      .then(userData => {
        const user = userData.rows;
        templateVars = {
          users: user
        }
        console.log(user, 'queryusers')
        res.render("user", templateVars)
      })
      .catch(err => {
        res.status(500).json({error: err.message});
      });
  })
  // GET -- LOGIN
  router.get("/login", (req, res) => {
    res.render('login');
  });
  router.get("/logout", (req, res) => {
    req.session.user_id = null;
    req.session = null;
    res.redirect('/');
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
  router.post("/register", (req, res) => {
    const name = 'testName';
    const defaultCity = 'testCity';
    const preferences = 'testPreferences';
    const email = req.body.username;
    const password = req.body.password;
    getUserWithEmail(email)
      .then(user => {
        if (user) {
          res.send('ALREADY EXISTS')
          return;
        }
        createNewUser(name, email, password, defaultCity, preferences)
          .then(res.redirect('/api/users'))
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
      key: apiKEY,
      city: 'Vancouver'
    };
    res.render("index", templateVars);
  });

  //============================== VALID USER ===============================//
  router.get("/create", (req, res) => {
    res.render("createMap");
  });
  router.post("/create", (req, res) => {

  });













  router.get("/maps", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT * FROM maps
    WHERE user_id = 2;
    `)
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

  router.get("/:users", (req, res) => {

  })

  return router;
};
