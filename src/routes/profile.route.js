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
  fetchUserProfileDetail,
} = require("../controllers/profile.controller");

router.get("/", fetchAllUsers);
router.get("/my_profile", checkAuth, fetchUserProfileDetail);
router.get("/:userId", fetchUserById);

router.put("/:userId", checkAuth, checkAction, updateUser);
router.delete("/:userId", checkAuth, checkAction, deleteUser);

module.exports = router;
