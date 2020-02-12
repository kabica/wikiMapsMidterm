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
  router.get('/maptest', (req,res) => {
    templateVars = {
      key: process.env.API_KEY
    }
    res.render('login', templateVars);
  })
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

  const createNewMap = function (map) {
    return db.query(`
    INSERT INTO maps (user_id, lat, lng, title, description)
    VALUES ($1 , $2 , $3 , $4, $5)
    RETURNING id;`, [map.user_id, map.lat, map.lng, map.title, map.description])
      .then(res => {
        return res.rows;
      })
      // console.log(chalk.yellow('FUNCITON CALL: ',res.rows[0].id));
      .catch((error) => {
        console.log(chalk.red('error: ', error))
      });
  };

  const createNewMarker = function (markerData) {
    let queryString = 'INSERT INTO markers (user_id, map_id, lat, lng, title, description, img_url) ';
    let paramString = '';
    const limit = markerData.length * 7;
    console.log(limit);
    for (let i = 0; i < limit; i += 7) {
      paramString = paramString + `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6}, $${i + 7}),`;
    }
    paramString = paramString.slice(0, -1);
    paramString = 'VALUES ' + paramString + ';';
    queryString += paramString;

    const queryData = [];
    markerData.forEach(marker => {
      marker.forEach(val => {
        queryData.push(val);
      })
    })
    console.log('QUERYSTRING : ', queryString);
    console.log('QUERYDATA : ', queryData);
    return db.query(queryString, queryData)
      .then(res => {
        console.log('MARKER TABLE: ', res.rows)
        res.rows;
      })
      .catch((error) => {
        console.log(chalk.red('error: ', error))
      });
  }


  router.post('/endpoint', function (req, res) {

    const userID = req.session.user_id;
    const title = '999';
    const description = '999';
    // const center = req.body[0];
    console.log('test', req.body);
    const mapLat = req.body[0].location.lat;
    const mapLng = req.body[0].location.lng;

    console.log(chalk.magenta('mapLAT ',mapLat));
    console.log(chalk.red('mapLNG: ', mapLng));

    createNewMap({
        user_id: userID,
        title: title,
        lat: mapLat,
        lng: mapLng,
        description: description
      })
      .then(res => {
        const mapID = res[0].id;
        let allMarkers = [];
        req.body.forEach(marker => {
          let temp = [];
          temp.push(userID, mapID, marker.location.lat, marker.location.lng, 'title', 'description', 'img_url')
          allMarkers.push(temp);
        })
        createNewMarker(allMarkers)
      })
      .then(console.log('DONE'))
      .catch((error) => {
        console.log(chalk.red('error: ', error))
      })
  });


  const getMapsByUserID = function(userID) {
    return db.query(`
      SELECT * FROM maps
      WHERE user_id = ${userID};
      `)
      .then(res => {
        return res.rows
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getMarkersByMapID = function(mapID) {
    return db.query(`
      SELECT * FROM markers
      WHERE map_id = ${mapID};
      `)
      .then(res => {
        return res.rows
      })
      .catch((error) => {
        console.log(error);
      });
  }
  router.get("/mymaps", (req, res) => {
    const userID = req.session.user_id;
    let mapIDs = [];
    let userMaps = [];
    getMapsByUserID(userID)
      .then(async result => {
        console.log(chalk.magenta(JSON.stringify(result)));
        result.forEach(map => {
          let mapData = {id: map.id, lat: map.lat, lng: map.lng, title: map.title, description: map.description}
          userMaps.push(mapData);
          mapIDs.push(map.id)
        })
        console.log(chalk.blue(JSON.stringify(userMaps)))
        console.log(chalk.magenta(JSON.stringify(mapIDs)))

        const [...userMarkers] = await Promise.all(mapIDs.map(getMarkersByMapID));
        const templateVars = {
          key: process.env.API_KEY,
          maps: userMaps,
          markers: userMarkers
        }
        res.render('login', templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });


      //res.render('login', templateVars)
  });





  router.get("/api/markers", (req, res) => {
    db.query(`SELECT * FROM markers;`)
      .then(data => {
        const AUSTIN = data.rows;
        res.json({
          AUSTIN
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });
  })

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
  router.get("/api/maps", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT * FROM maps;`)
      .then(data => {
        const maps = data.rows;
        // const finalData = JSON.stringify(maps).replace(/\\/g, '');
        res.json({
          maps
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
        req.session.user_id = user.id;
        res.redirect('/');
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
        res.status(500).json({
          error: err.message
        });
      });
  })
  // GET -- LOGIN
  router.get("/logout", (req, res) => {
    req.session.user_id = null;
    req.session = null;
    res.redirect('/');
  });


  //============================== REGISTER ===============================//
  // router.get("/register", (req, res) => {
  //   templat
  //   res.render("register");
  // });
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

    db.query(`SELECT * FROM maps;
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
    })
  });

  router.get("/api/all", (req, res) => {
    db.query(`SELECT * FROM users JOIN maps ON users.id = user_id GROUP BY users.id, maps.id LIMIT 2;`)
      .then(userData => {
        res.send(userData.rows[0])
      })
      .catch(err => {
        res.status(500).json({
          error: err.message
        });
      });
  })



  return router;
};
