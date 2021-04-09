const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

const {fetchCurrentUser,fetchAllUsers,fetchUserById} = require("../controllers/user/getUser")

router.get("/", fetchAllUsers);
router.get("/me", checkAuth, fetchCurrentUser);
router.get("/:userId", fetchUserById);

module.exports = router;
