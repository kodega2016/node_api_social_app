const express = require("express");
const router = express.Router();

const { register, login, me, logout } = require("../controllers/auth");
const { protect } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../validations/authValidator");

router.route("/login").post(validateLogin, login);
router.route("/register").post(validateRegister, register);
router.route("/me").get(protect, me);
router.route("/logout").get(protect, logout);

module.exports = router;
