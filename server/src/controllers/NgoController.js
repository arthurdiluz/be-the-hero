const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const NGO = require("../database/models/ngo");
const Incident = require("../database/models/incident");

module.exports = {
  async create(req, res) {
    try {
      const errors = validationResult(req)["errors"];

      if (errors.length) return res.status(422).json(errors);

      const { name, email, password, whatsapp, city, state } = req.body;
      const id = crypto.randomBytes(4).toString("hex");
      const hashedPassword = bcrypt.hashSync(password, 10);

      const ngo = await NGO.create({
        id,
        name,
        email,
        whatsapp,
        city,
        state,
        password: hashedPassword,
      });

      if (!ngo) {
        return res.status(400).json('Could not create NGO')
      }

      return res.status(201).json(ngo);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async index(req, res) {
    try {
      const errors = validationResult(req)["errors"];

      if (errors.length) return res.status(422).json(errors);

      const ngos = await NGO.find({});

      if (!ngos) return res.status(406).json(error);
      return res.status(200).json(ngos);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      const errors = validationResult(req)["errors"];
      const { id } = req.params || null;

      if (errors.length) return res.status(422).json(errors);
      if (!id) return res.status(400).json({ error: "id not set" });

      const ngo = await NGO.findOne({ id });

      if (!ngo) return res.status(404).json(error);

      return res.status(200).json(ngo);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req)["errors"];

      if (errors.length) return res.status(422).json(errors);

      const { name, email, whatsapp, city, state } = req.body;
      const { ngo_id } = req.headers;
      let { password } = req.body || null;
      let currentPassword = null;

      if (!(await NGO.findOne({ id: ngo_id }))) {
        return res.status(404).json("NGO ID not found");
      }

      currentPassword = (await NGO.findOne({ id: ngo_id }))["password"] || null;

      if (!currentPassword) {
        return res.status(404).json({
          error: `NGO '${name}' not found`,
        });
      }

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

      const updatedNgo = await NGO.findOneAndUpdate(
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
          updated_at: new Date.now(),
        }
      );

      if (!updatedNgo) {
        return res.status(406).json("NGO could not be updated");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async delete(req, res) {
    try {
      const errors = validationResult(req)["errors"];

      if (errors.length) return res.status(422).json(errors);

      const { ngo_id } = req.headers;
      const ngo = (await NGO.findOne({ id: ngo_id })) || null;

      if (!ngo) {
        return res.status(404).json(`NGO with ID '${ngo_id}' not found`);
      }

      await Incident.deleteMany({
        ngo_owner: await NGO.findOne({ id: ngo_id }),
      });

      await NGO.deleteOne({ id: ngo_id });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
