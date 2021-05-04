const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const checkAction = require("../middlewares/checkAction");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
} = require("../controllers/profile.controller");

router.get("/", fetchAllUsers);
router.get("/:userId", fetchUserById);

router.get("/:userId", checkAuth, checkAction, updateUser);
router.post("/:userId", checkAuth, checkAction, deleteUser);

module.exports = router;
