const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllPage,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/page.controller");

router.get("/", fetchAllPage);
router.post("/", checkAuth, isAdmin, createPage);
router.put("/:pageId", checkAuth, isAdmin, updatePage);
router.delete("/:pageId", checkAuth, isAdmin, deletePage);

module.exports = router;
