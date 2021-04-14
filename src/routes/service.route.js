const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

const {
  fetchAllServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.get("/", fetchAllServices);
router.get("/:serviceId", fetchServiceById);
router.post("/", checkAuth, createService);
router.put("/:serviceId", checkAuth, updateService);
router.delete("/:serviceId", checkAuth, deleteService);

module.exports = router;
