const Page = require("../models/page.model");

exports.fetchAllPage = async (req, res, next) => {
  try {
    const pages = await Page.find();
    const count = await Page.estimatedDocumentCount();
    return res.status(200).json({
      type: "success",
      message: "fetch all  pages",
      data: {
        meta: {
          count,
        },

        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createPage = async (req, res, next) => {
  try {
    const newPage = new Page({
      ...req.body,
    });

    const page = await newPage.save();
    return res.status(200).json({
      type: "success",
      message: "create new page",
      data: {
        page,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Page already exists" });
    } else {
      next(error);
    }
  }
};

exports.updatePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.pageId, req.body, {
      new: true,
    });
    return res.status(200).json({
      type: "success",
      message: "page updated",
      data: {
        page,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Page already exists" });
    } else {
      next(error);
    }
  }
};

exports.deletePage = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.pageId);
    return res.status(200).json({
      type: "success",
      message: "page deleted",
      data: {
        page,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Page already exists" });
    } else {
      next(error);
    }
  }
};
