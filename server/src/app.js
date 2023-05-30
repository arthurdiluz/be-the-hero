// importing module dependencies
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const routes = require("./routes");
const db = require("./database");

// setup 'request.session' rules
const sessionOptions = session({
  secret: process.env["SESSION_SECRET"], // secret key
  store: MongoStore.create({ mongoUrl: db.uri }),
  resave: false, // avoid duplicated sesssions
  saveUninitialized: false, // force uninitialized session to be saved
  cookie: {
    // cookie setup that will be saved in database
    maxAge: 86400000, // how long the cookie will last in db | 30 secs
    httpOnly: true, // the cookie will only be sent over HTTP(s) responses
  },
});

// setting up routes
const app = express(); // create app with routes' structures
app.use(cors({ origin: "*" })); // control access permissions in URLs
app.use(logger("dev")); // create middleware log
app.use(express.json()); // add JSON conversor
app.use(express.urlencoded({ extended: false })); // use query string
app.use(cookieParser()); // parse HTTP request cookies
app.use(helmet()); // set 12 middlewares that will setup responses headers
app.use(sessionOptions); // set 'request.session'

// add routes to server
app.use(routes);

// exports module
module.exports = app;
