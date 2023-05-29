const jwt = require("jsonwebtoken");

module.exports = {
  isAuthenticated: async (req, res, next) => {
    try {
      const accessToken = req.session["access_token"];

      if (!accessToken) {
        return res.status(401).json({ error: "Unauthenticated" });
      }

      const token = jwt.verify(accessToken, process.env["SESSION_SECRET"]);

      if (!token) {
        return res.status(403).json({ error: "Invalid token" });
      }

      req.session.user = { id: token?.id };

      next();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
