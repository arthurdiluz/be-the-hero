const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
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

      const ngo = await NGO.findOne({ email });

      if (!ngo) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isCorrectPassword = await bcrypt.compare(password, ngo.password);

      if (!isCorrectPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ id: ngo.id }, process.env["SESSION_SECRET"], {
        expiresIn: "86400000",
      });

      req.session.access_token = token;
      await req.session.save();

      return await res.status(202).json({ access_token: token });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async destroy(req, res) {
    await req.session.destroy();
    return res.status(204).send();
  },
};
