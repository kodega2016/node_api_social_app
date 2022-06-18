const express = require("express");
const router = express.Router();

const { index, show, update, destroy } = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(index);
router.route("/:id").get(show).put(protect, update).delete(protect, destroy);

module.exports = router;
