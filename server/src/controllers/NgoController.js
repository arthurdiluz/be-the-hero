const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const NGO = require("../database/models/ngo");
const Incident = require("../database/models/incident");

module.exports = {
  async create(req, res) {
    const errors = validationResult(req)["errors"];
    if (errors.length) return res.status(422).json(errors);

    const { name, email, password, whatsapp, city, state } = req.body;
    const id = crypto.randomBytes(4).toString("hex");
    const hashedPassword = bcrypt.hashSync(password, 10);

    const ngo = {
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
      whatsapp: whatsapp,
      city: city,
      state: state,
    };

    try {
      NGO.create(ngo, (error, ngo) => {
        if (error) return res.status(400).json(error);
        return res.status(201).json(ngo);
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async index(req, res) {
    const errors = validationResult(req)["errors"];
    if (errors.length) return res.status(422).json(errors);

    try {
      NGO.find({}, (error, ngos) => {
        if (error) return res.status(406).json(error);
        return res.status(200).json(ngos);
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async show(req, res) {
    const errors = validationResult(req)["errors"];
    const { id } = req.params || null;

    if (errors.length) return res.status(422).json(errors);
    if (!id) return res.status(400).json({ error: "id not set" });

    try {
      NGO.findOne({ id: id }, (error, ngo) => {
        if (error) return res.status(404).json(error);
        return res.status(200).json(ngo);
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async update(req, res) {
    const errors = validationResult(req)["errors"];
    if (errors.length) return res.status(422).json(errors);

    const { name, email, whatsapp, city, state } = req.body;
    let { password } = req.body || null;
    const { ngo_id } = req.headers;
    let currentPassword = null;

    try {
      NGO.findOne({ id: ngo_id }, (error) => {
        if (error) return res.status(404).json(error);
      });
    } catch (error) {
      return res.status(500).json(error);
    }

    try {
      currentPassword = (await NGO.findOne({ id: ngo_id }))["password"];
    } catch (error) {
      return res.status(500).json(error);
    }

    if (!currentPassword)
      return res.status(404).json({
        error: `NGO '${name}' not found`,
      });

    if (bcrypt.compareSync(password, currentPassword)) {
      password = currentPassword;
    } else {
      bcrypt
        .hash(password, 10)
        .then((pwd) => {
          password = pwd;
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    }

    try {
      NGO.findOneAndUpdate(
        {
          id: ngo_id,
        },
        {
          name: name,
          email: email,
          password: password,
          whatsapp: whatsapp,
          city: city,
          state: state,
          created_at: (await NGO.findOne({ id: ngo_id }))["created_at"],
          updated_at: Date.now(),
        },
        (error) => {
          if (error) return res.status(406).json(error);
          return res.status(204).send();
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async delete(req, res) {
    const errors = validationResult(req)["errors"];
    if (errors.length) return res.status(422).json(errors);

    const { ngo_id } = req.headers;

    // check whether if the given NGO exists
    try {
      const ngo = (await NGO.findOne({ id: ngo_id })) || null;
      if (!ngo)
        return res.status(404).json(`NGO with ID '${ngo_id}' not found`);
    } catch (error) {
      return res.status(500).json(error);
    }

    // delete NGO incidents
    try {
      Incident.deleteMany(
        {
          ngo_owner: await NGO.findOne({ id: ngo_id }),
        },
        (error) => {
          if (error) return res.status(404).json(error);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }

    // delete NGO
    try {
      NGO.deleteOne({ id: ngo_id }, (error) => {
        if (error) return res.status(404).json(error);
        return res.status(204).send();
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
