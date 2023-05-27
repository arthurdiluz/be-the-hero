const { body, param } = require("express-validator");

module.exports = {
  bodyCheck: [
    body("title").isLength({
      min: 3,
      max: 31,
    }),
    body("description").isLength({
      min: 3,
      max: 511,
    }),
    body("value")
      .isLength({
        min: 1,
        max: 15,
      })
      .withMessage("Monetary value not allowed")
      .isNumeric(),
  ],
  paramCheck: [
    param("id").isLength({
      min: 8,
      max: 8,
    }),
  ],
};
