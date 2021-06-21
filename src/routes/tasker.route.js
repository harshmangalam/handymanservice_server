const router = require("express").Router();
const checkAuth = require("../middlewares/checkAuth");
const isTasker = require("../middlewares/isTasker");
const { fetchTaskerHomeData } = require("../controllers/tasker.controller");

router.get("/", checkAuth, isTasker, fetchTaskerHomeData);

module.exports = router;
