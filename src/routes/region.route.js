const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllRegions,
  createRegion,
  deleteRegion,
} = require("../controllers/region.controller");

router.get("/", fetchAllRegions);
router.post("/", checkAuth, isAdmin, createRegion);
router.delete("/:regionId", checkAuth, isAdmin, deleteRegion);

module.exports = router;
