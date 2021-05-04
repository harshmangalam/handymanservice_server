const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  fetchSuggestedServices,
  fetchServiceName,
} = require("../controllers/service.controller");

router.get("/", fetchAllServices);
router.get("/fetch_service_name", fetchServiceName);
router.get("/suggested_services", fetchSuggestedServices);
router.get("/:serviceId", fetchServiceById);
router.post("/", checkAuth, isAdmin, createService);
router.put("/:serviceId", checkAuth, isAdmin, updateService);
router.delete("/:serviceId", checkAuth, isAdmin, deleteService);

module.exports = router;
