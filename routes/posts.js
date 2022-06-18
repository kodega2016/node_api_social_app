const express = require("express");
const router = express.Router();
const { validateSavePost } = require("../validations/postsValidator");

const { index, save, update, show, destroy } = require("../controllers/posts");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(index).post(protect, validateSavePost, save);
router.route("/:id").get(show).put(protect, update).delete(protect, destroy);

module.exports = router;
