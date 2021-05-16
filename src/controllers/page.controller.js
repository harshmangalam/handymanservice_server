const Page = require("../models/page.model");
const slugify = require("../utils/slug");
exports.fetchAllPage = async (req, res, next) => {
  try {
    const pages = await Page.find().select("-content").populate("creator","name");
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

exports.fetchPageSlug = async (req, res, next) => {
  try {
    const pages = await Page.find().select("title slug");
    return res.status(200).json({
      type: "success",
      message: "fetch all  pages",
      data: {
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.pageSlug });
    return res.status(200).json({
      type: "success",
      message: "fetch  page slug",
      data: {
        page,
      },
    });
  } catch (error) {
    next(error);
  }
};



exports.createPage = async (req, res, next) => {
  try {
    const slug = slugify(req.body.title);
    const currentUser = res.locals.user;

    const newPage = new Page({
      ...req.body,
      creator: currentUser._id,
      slug,
    });

    const savePage = await newPage.save();

    return res.status(200).json({
      type: "success",
      message: "create new page",
      data: {
        pageId: savePage._id,
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
      data:null
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Page already exists" });
    } else {
      next(error);
    }
  }
};
