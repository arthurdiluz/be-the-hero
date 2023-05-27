const { validationResult } = require("express-validator");
const crypto = require("crypto");
const Incident = require("../database/models/incident");
const NGO = require("../database/models/ngo");
const incident = require("../database/models/incident");

module.exports = {
  async create(req, res) {
    const { errors } = validationResult(req);
    if (errors.length) return res.status(422).json(errors);

    const { title, description, value } = req.body;
    const { ngo_id } = req.headers;
    const id = crypto.randomBytes(4).toString("hex");
    let incident = null;

    try {
      if (!(await NGO.find({ id: ngo_id })).length) {
        return res.status(404).json({
          error: `NGO with id ${ngo_id} not found`,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }

    try {
      incident = await Incident.create({
        id: id,
        title: title,
        description: description,
        value: Number(value),
        ngo_owner: await NGO.findOne({ id: ngo_id }),
      });
    } catch (error) {
      return res.status(500).json(error);
    }

    try {
      NGO.findOneAndUpdate(
        {
          id: ngo_id,
        },
        {
          $push: {
            incidents: incident,
          },
        },
        (error) => {
          if (error) return res.status(204).json(error);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(201).json({ id: incident["id"] });
  },

  async index(req, res) {
    const { page = 1 } = req.query; // get page param value; set 1 if any page param exist
    const count = await incident.count(); // counts the amount of incidents existent
    const limPage = 5; // amount of registers per page
    let incidents = null;

    try {
      incidents = await Incident.find() // get all incidents from database
        .populate({
          // join 'ngo' columns with 'incident' specific columns
          path: "ngo_owner",
          select: ["name", "email", "whatsapp", "city", "state"],
        })
        .limit(limPage) // limit return registers
        .skip((page - 1) * limPage); // set registers to be presented
    } catch (error) {
      return res.status(500).json(error);
    }

    /* when making pagination, the amount of items in database
    is sent to front-end through the response's header */
    res.header("x-total-count", count);

    return res.status(206).json(incidents);
  },

  async show(req, res) {
    const { errors } = validationResult(req);
    if (errors.length) return res.status(422).json(errors);

    const { id } = req.params;

    try {
      Incident.findOne({ id: id }, (error, incident) => {
        if (error) return res.status(404).json(error);
        return res.status(200).json(incident);
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async update(req, res) {
    const { errors } = validationResult(req);
    if (errors.length) return res.status(422).json(errors);

    const { id } = req.params;
    const { title, description, value } = req.body;

    try {
      Incident.findOneAndUpdate(
        {
          id: id,
        },
        {
          title: title,
          description: description,
          value: value,
          created_at: (await Incident.findOne({ id: id }))["created_at"],
          updated_at: Date.now(),
        },
        (error) => {
          if (error) return res.status(400).json(error);
          return res.status(201).send();
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
    const { id: incident_id } = req.params;

    // check whether given incident exists and its NGO
    try {
      Incident.findOne({ id: incident_id }, (error, incident) => {
        if (error) return res.status(400).json(error);
        if (!incident)
          return res
            .status(404)
            .json(`Incident with id '${incident_id}' not found`);
        NGO.findOne({ id: ngo_id }, (error) => {
          if (error) return res.status(404).json(error);
        });
      });
    } catch (error) {
      return res.status(500).json(error);
    }

    // remove incident from NGO list of incidents
    try {
      const { _id: objId } =
        (await Incident.findOne({ id: incident_id }, "_id")) || null;
      if (objId === null)
        return res
          .status(404)
          .json(`Incident with ID ${incident_id} not found`);

      NGO.findOne({ id: ngo_id }, (error, ngo) => {
        if (error) return res.status(400).json(error);

        const incidentIndex = ngo.incidents.indexOf(objId);

        if (incidentIndex === -1)
          return res.status(404).json("Incident not registered in this NGO");

        ngo.incidents.splice(incidentIndex, 1); // remove incident from NGO incidents list
        ngo.save((error) => {
          if (error) return res.status(400).json("Could not save changes");
        });
      });
    } catch (error) {
      return res.status(500).json(error);
    }

    // remove incident from database
    try {
      Incident.deleteOne({ id: incident_id }, (error) => {
        if (error) return res.status(400).json(error);
      });
    } catch (error) {
      return res.status(500).json(error);
    }
    return res.status(204).send();
  },
};
