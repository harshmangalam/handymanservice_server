const express = require("express");
const router = express.Router();

const {
  countDocuments,
  getAllAdmins,
} = require("../controllers/admin.controller");

router.get("/", countDocuments);
router.get("/all_admins", getAllAdmins);

module.exports = router;
