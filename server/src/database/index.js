const mongoose = require("mongoose");
require("dotenv").config();

mongoose["uri"] = process.env["MONGODB_URI"];

if (!mongoose?.uri) {
  throw new mongoose.Error("URI not provided");
}

mongoose.connect(mongoose.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
