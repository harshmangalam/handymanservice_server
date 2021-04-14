const {
  CATEGORY_ALREADY_EXISTS_ERR,
  ACCESS_DENIED_ERR,
  CATEGORY_NOT_FOUND_ERR,
} = require("../errors");

const Category = require("../models/category.model");

const { DEFAULT_NO_IMG } = require("../constant");
// ------------------------------------

// feth all categories
exports.fetchAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      type: "success",
      message: "fetch all categories",
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
    const category = await Category.findById(req.params.categoryId);
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
    let { name, description, image } = req.body;
    const currentUser = res.locals.user;

    name = name.toLowerCase();
    image = image ? image : DEFAULT_NO_IMG;

    const category = await Category.findOne({ name });

    if (category) {
      next({ status: 400, message: CATEGORY_ALREADY_EXISTS_ERR });
      return;
    }

    const newCategory = new Category({
      name,
      description,
      image,
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
    next(error);
  }
};

// ------------------------------------

// update category

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    let { name, description, image } = req.body;

    name = name.toLowerCase();

    image = image ? image : DEFAULT_NO_IMG;

    const currentUser = res.locals.user;

    const myCat = await Category.findById(categoryId);

    if (!myCat) {
      next({ status: 404, message: CATEGORY_NOT_FOUND_ERR });
      return;
    }

    // only category creator can modify data

    if (myCat.creator.toString() !== currentUser._id.toString()) {
      next({ status: 401, message: ACCESS_DENIED_ERR });
      return;
    }

    // name of same user can be same check name duplication on name change from previous name

    if (name !== myCat.name) {
      const category = await Category.findOne({ name });

      if (category) {
        next({ status: 400, message: CATEGORY_ALREADY_EXISTS_ERR });
        return;
      }
    }

    // finally update category

    const modifyCat = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        description,
        image,
      },
      { new: true }
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
    next(error);
  }
};

// ------------------------------------

// delete  category by category id
exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const currentUser = res.locals.user;
    const category = await Category.findById(categoryId);

    if (!category) {
      next({ status: 404, mesage: CATEGORY_NOT_FOUND_ERR });
      return;
    }

    // only creator can delete their category
    if (category.creator.toString() !== currentUser._id.toString()) {
      next({ status: 401, message: ACCESS_DENIED_ERR });
      return;
    }

    // finally delete

    await category.delete();

    return res.status(200).json({
      type: "success",
      message: " category deleted succesfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
