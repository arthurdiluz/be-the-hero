module.exports = {
  isAuthenticated: (req, res, next) => {
    // this authentication verification must be updated
    if (req.session.isAuthenticated) {
      return next();
    } else {
      return res.status(401).json({ error: "Unauthenticated" });
    }
  },
};
