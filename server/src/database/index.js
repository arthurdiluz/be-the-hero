const mongoose = require("mongoose");
require("dotenv").config();

const env = {
  username: process.env.USER,
  password: process.env.PASSWORD,
  db_table: process.env.DB_TABLE,
};

// eslint-disable-next-line quotes
mongoose[
  "uri"
] = `mongodb+srv://${env.username}:${env.password}@bethehero.9qryn.mongodb.net/${env.db_table}`;

mongoose.connect(mongoose.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
