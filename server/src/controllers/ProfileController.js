const NGO = require("../database/models/ngo");
const Incident = require("../database/models/incident");

module.exports = {
  async index(req, res) {
    const {id: userId} = req.session?.user || null;
    const { page = 1 } = req.query;
    const limPage = 5;

    try {
      if (!userId) return res.status(404).json(`NGO ID ${userId} not found`);

      const count = (await NGO.findOne({ id: userId }))["incidents"].length;
      const incidents = await Incident.find({
        ngo_owner: await NGO.find({ id: userId }),
      })
        .populate({
          path: "ngo_owner",
          select: [
            "id",
            "title",
            "description",
            "value",
            "ngo_owner",
            "created_at",
            "updated_at",
          ],
        })
        .limit(limPage)
        .skip((page - 1) * limPage);

      res.header("X-Total-Count", count["count(*)"]);

      return res.status(200).json(incidents);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
