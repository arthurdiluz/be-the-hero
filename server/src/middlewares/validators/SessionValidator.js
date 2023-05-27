const { body } = require("express-validator");

module.exports = {
  bodyCheck: [
    body("email").isEmail().isLength({
      min: 7,
      max: 63,
    }),
  ],
};
