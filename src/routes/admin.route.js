const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const checkAction = require("../middlewares/checkAction");
const isAdmin = require("../middlewares/isAdmin");

const { countDocuments } = require("../controllers/admin.controller");

router.get("/", countDocuments);

module.exports = router;
