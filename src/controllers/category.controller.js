const Category = require("../models/category.model");

// fetch all categories
exports.fetchAllCategories = async (req, res, next) => {
  try {
    let { limit } = req.query;

    const categories = await Category.find().limit(Number(limit));

    const count = await Category.estimatedDocumentCount();
    return res.status(200).json({
      type: "success",
      message: "fetch all categories",
      data: {
        meta: {
          count,
        },
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch category name

exports.fetchCategoryName = async (req, res, next) => {
  try {
    const categories = await Category.find().select("name");
    return res.status(200).json({
      type: "success",
      message: "fetch all categories name",
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// fetch  category by category id
exports.fetchCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId).populate(
      "creator",
      "name"
    );
    return res.status(200).json({
      type: "success",
      message: "fetch single category by id",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// create new category

exports.createCategory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const newCategory = new Category({
      ...req.body,
      creator: currentUser._id,
    });

    const saveCategory = await newCategory.save();

    return res.status(200).json({
      type: "success",
      message: "category created successfully",
      data: {
        categoryId: saveCategory._id,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Category already exists" });
    } else {
      next(error);
    }
  }
};

// ------------------------------------

// update category

exports.updateCategory = async (req, res, next) => {
  try {
    const modifyCat = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      {
        new: true,
      }
    );

    // send updated category
    return res.status(200).json({
      type: "success",
      message: "category updated successfully",
      data: {
        category: modifyCat,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Category already exists" });
    } else {
      next(error);
    }
  }
};

// ------------------------------------

// delete  category by category id
exports.deleteCategory = async (req, res, next) => {
  try {
    // finally delete

    await Category.findByIdAndDelete(req.params.categoryId);

    return res.status(200).json({
      type: "success",
      message: " category deleted succesfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
