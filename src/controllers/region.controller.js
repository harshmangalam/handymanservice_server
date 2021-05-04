const Region = require("../models/region.model");

// feth all regions

exports.fetchAllRegions = async (req, res, next) => {
  try {
    const regions = await Region.find();

    const count = await Region.estimatedDocumentCount();
    return res.status(200).json({
      type: "success",
      message: "fetch all regions",
      data: {
        meta: {
          count,
        },
        regions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// create new region

exports.createRegion = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const newRegion = new Region({
      ...req.body,
      creator: currentUser._id,
    });

    const saveRegion = await newRegion.save();

    return res.status(200).json({
      type: "success",
      message: "region created successfully",
      data: {
        regionId: saveRegion._id,
      },
    });
  } catch (error) {
    if (error.code == 11000) {
      next({ status: 400, message: "Region already exists" });
    } else {
      next(error);
    }
  }
};

// ------------------------------------

// delete  region
exports.deleteRegion = async (req, res, next) => {
  try {
    await Region.findByIdAndDelete(req.params.regionId);

    return res.status(200).json({
      type: "success",
      message: " region deleted succesfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
