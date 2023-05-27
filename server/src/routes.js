const router = require("express")();

// import validators
const middlewares = require("./middlewares/index");
const ngoValidator = require("./middlewares/validators/NgoValidator");
const incidentValidator = require("./middlewares/validators/IncidentValidator");
const sessionValidator = require("./middlewares/validators/SessionValidator");

// import controllers
const NgoController = require("./controllers/NgoController");
const IncidentController = require("./controllers/IncidentController");
const ProfileController = require("./controllers/ProfileController");
const SessionController = require("./controllers/SessionController");

// setup URIs (paths)
router.post("/ngo", ngoValidator.bodyCheck, NgoController.create);
router.get("/ngos", NgoController.index);
router.get("/ngo/:id", ngoValidator.paramCheck, NgoController.show);
router.put(
  "/ngo",
  middlewares.isAuthenticated,
  ngoValidator.bodyCheck,
  NgoController.update
);
router.delete(
  "/ngo/:id",
  middlewares.isAuthenticated,
  ngoValidator.paramCheck,
  NgoController.delete
);

router.post(
  "/incident",
  middlewares.isAuthenticated,
  incidentValidator.bodyCheck,
  IncidentController.create
);
router.get("/incidents", IncidentController.index);
router.get(
  "/incident/:id",
  incidentValidator.paramCheck,
  IncidentController.show
);
router.put(
  "/incident/:id",
  middlewares.isAuthenticated,
  incidentValidator.bodyCheck,
  IncidentController.update
);
router.delete(
  "/incident/:id",
  middlewares.isAuthenticated,
  incidentValidator.paramCheck,
  IncidentController.delete
);

router.get("/profile", middlewares.isAuthenticated, ProfileController.index);

router.post("/session", sessionValidator.bodyCheck, SessionController.create);
router.delete(
  "/session",
  middlewares.isAuthenticated,
  SessionController.destroy
);

// export router with paths
module.exports = router;
