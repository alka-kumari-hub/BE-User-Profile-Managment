const express = require("express");
const {
  login,
  register,
  getUserByUserId,
  updateUser,
} = require("../controllers");
const { isAuth } = require("../controllers/isAuth");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", isAuth, getUserByUserId);
router.patch("/profile", isAuth, updateUser);

module.exports = router;
