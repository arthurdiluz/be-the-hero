const { body, param } = require("express-validator");

module.exports = {
  bodyCheck: [
    body("name").isString().isLength({
      min: 3,
      max: 31,
    }),
    body("email").isEmail().isLength({
      max: 31,
    }),
    body("password").isString().isLength({
      min: 7,
      max: 31,
    }),
    body("whatsapp").isMobilePhone().isNumeric().isLength({
      max: 15,
    }),
    body("city").isString().isLength({
      min: 3,
      max: 31,
    }),
    body("state").isString().isAlpha().isLength(2),
  ],
  paramCheck: [
    param("id").isLength({
      min: 8,
      max: 8,
    }),
  ],
};
