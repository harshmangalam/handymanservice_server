const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const {
  fetchAllCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryName,
} = require("../controllers/category.controller");

router.get("/", fetchAllCategories);
router.get("/fetch_name", fetchCategoryName);

router.get("/:categoryId", fetchCategoryById);
router.post("/", checkAuth, isAdmin, createCategory);
router.put("/:categoryId", checkAuth, isAdmin, updateCategory);
router.delete("/:categoryId", checkAuth, isAdmin, deleteCategory);

module.exports = router;
