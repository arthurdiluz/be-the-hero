module.exports = {
  isAuthenticated: (req, res, next) => {
    // FIXME: req.session.isAuthenticated does not exist (but should)
    if (req.session.isAuthenticated) {
      return next();
    } else {
      return res.status(401).json({ error: "Unauthenticated" });
    }
  },
};
