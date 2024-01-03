const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/movies", require("./movies"));
router.use("/reviews", require("./reviews"));
router.use("/comments", require("./comments"));

module.exports = router;
