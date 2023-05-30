const { validationResult } = require("express-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Incident = require("../database/models/incident");
const NGO = require("../database/models/ngo");
const incident = require("../database/models/incident");

module.exports = {
  async create(req, res) {
    try {
      const { errors } = validationResult(req);

      if (errors.length) return res.status(422).json(errors);

      const { title, description, value } = req.body;
      const { access_token } = req.headers;
      const id = crypto.randomBytes(4).toString("hex");
      const { id: ngoId } = jwt.decode(access_token) || undefined;

      if (!(await NGO.find({ id: ngoId })).length) {
        return res.status(404).json({
          error: `NGO with id ${ngoId} not found`,
        });
      }

      const incident = await Incident.create({
        id: id,
        title: title,
        description: description,
        value: Number(value),
        ngo_owner: await NGO.findOne({ id: ngoId }),
      });

      await NGO.findOneAndUpdate(
        { id: ngoId },
        { $push: { incidents: incident } }
      );

      return res.status(201).json({ id: incident["id"] });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async index(req, res) {
    try {
      const { page = 1 } = req.query; // get page param value; set 1 if any page param exist
      const count = await incident.count(); // counts the amount of incidents existent
      const limPage = 5; // amount of registers per page

      const incidents = await Incident.find() // get all incidents from database
        .populate({
          // join 'ngo' columns with 'incident' specific columns
          path: "ngo_owner",
          select: ["name", "email", "whatsapp", "city", "state"],
        })
        .limit(limPage) // limit return registers
        .skip((page - 1) * limPage); // set registers to be presented

      /* when making pagination, the amount of items in database
      is sent to front-end through the response's header */
      res.header("x-total-count", count);

      return res.status(206).json(incidents);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      const { errors } = validationResult(req);

      if (errors.length) return res.status(422).json(errors);

      const { id } = req.params;
      const incident = await Incident.findOne({ id: id });

      if (!incident) {
        return res.status(404).json({ error: `Incident ID "${id}" not found` });
      }

      return res.status(200).json(incident);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async update(req, res) {
    try {
      const { errors } = validationResult(req);

      if (errors.length) return res.status(422).json(errors);

      const { id } = req.params;
      const { title, description, value } = req.body;

      const updated = await Incident.findOneAndUpdate(
        { id },
        {
          $set: {
            title,
            description,
            value,
            updated_at: new Date(),
          },
        }
      );

      if (!updated) {
        return res.status(400).json({ error: "Incident could not be updated" });
      }

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async delete(req, res) {
    try {
      const errors = validationResult(req)["errors"];

      if (errors.length) return res.status(422).json(errors);

      const { id: incidentId } = req.params;
      const { access_token } = req.headers;
      const { id: ngoId } = jwt.decode(access_token) || undefined;

      const incident = await Incident.findOne({ id: incidentId });
      const ngo = await NGO.findOne({ id: ngoId });

      if (!incident) {
        return res.status(404).json(`Incident with id '${id}' not found`);
      }

      if (!ngo) {
        return res.status(404).json({
          error: `NGO with id ${ngoId} not found`,
        });
      }

      // remove incident from NGO list of incidents
      const { _id: objId } =
        (await Incident.findOne({ id: incidentId }, "_id")) || null;

      if (!objId) {
        return res.status(404).json(`Incident with ID ${incidentId} not found`);
      }

      const incidentIndex = ngo.incidents.indexOf(objId.toString());

      if (incidentIndex === -1) {
        return res.status(404).json("Incident not registered in this NGO");
      }

      // remove incident from NGO incidents list
      ngo.incidents.splice(incidentIndex, 1);
      ngoSave = await ngo.save();

      if (!ngoSave) {
        return res.status(400).json({ error: "Could not save changes" });
      }

      // remove incident from database
      await Incident.deleteOne({ id: incidentId });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
