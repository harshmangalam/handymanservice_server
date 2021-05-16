const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllPage,
  createPage,
  updatePage,
  deletePage,
  fetchPageBySlug,
  fetchPageSlug,
} = require("../controllers/page.controller");

router.get("/", fetchAllPage);
router.get("/page_slug", fetchPageSlug);
router.get("/:pageSlug", fetchPageBySlug);


router.post("/", checkAuth, isAdmin, createPage);
router.put("/:pageId", checkAuth, isAdmin, updatePage);
router.delete("/:pageId", checkAuth, isAdmin, deletePage);

module.exports = router;
