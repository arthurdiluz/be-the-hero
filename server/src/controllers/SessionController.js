const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const NGO = require("../database/models/ngo");

module.exports = {
  async create(req, res) {
    try {
      const { email, password } = req.body;
      const { errors } = validationResult(req);

      if (errors.length) {
        return res.status(422).json(errors);
      }

      const ngo = await NGO.findOne({ email: email });

      if (!ngo) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      bcrypt
        .compare(password, ngo.password)
        .then((isMatch) => {
          if (isMatch) {
            Object.assign(req.session, { isAuthenticated: true });
            req.session.save((error) => {
              if (error) return res.status(500).json(error);
              return res.status(202).json({
                id: ngo.id,
                name: ngo.name,
                email: ngo.email,
                whatsapp: ngo.whatsapp,
                city: ngo.city,
                state: ngo.state,
                incidents: ngo.incidents,
                created_at: ngo.created_at,
                updated_at: ngo.updated_at,
              });
            });
          } else {
            return res.status(401).json({ error: "Invalid password" });
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: error });
        });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async destroy(req, res) {
    req.session.destroy(() => {
      return res.status(204).send();
    });
  },
};
