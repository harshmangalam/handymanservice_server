const { DEFAULT_NO_IMG } = require("../constant");
const { ACCESS_DENIED_ERR, SERVICE_NOT_FOUND_ERR } = require("../errors");

const Service = require("../models/service.model");

// ------------------------------------

// feth all services
exports.fetchAllServices = async (req, res, next) => {
  try {
    let { categoryName, page, limit } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let services;
    let count;

    if (categoryName) {
      services = await Service.find({ category: categoryName })
        .limit(limit)
        .skip(limit * page)
        .populate("creator", "name")
        .populate("category");

      count = await Service.countDocuments({ category: categoryName });
    } else {
      services = await Service.find()
        .limit(limit)
        .skip(limit * page)
        .populate("creator", "name")
        .populate("category");

      count = await Service.estimatedDocumentCount();
    }

    return res.status(200).json({
      type: "success",
      message: "fetch  services",
      data: {
        meta: {
          count,
        },
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch  service by service id

exports.fetchServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate("creator", "name")
      .populate("category");

    return res.status(200).json({
      type: "success",
      message: "fetch single service by id",
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch suggested  service

exports.fetchSuggestedServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate("creator", "name")
      .populate("category");

    return res.status(200).json({
      type: "success",
      message: "fetch suggested services",
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// create new service

exports.createService = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const newService = new Service({
      ...req.body,
      creator: currentUser._id,
    });

    const saveService = await newService.save();

    return res.status(200).json({
      type: "success",
      message: "service created successfully",
      data: {
        serviceId: saveService._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// update service

exports.updateService = async (req, res, next) => {
  try {
    // finally update service

    const modifyService = await Service.findByIdAndUpdate(serviceId, req.body, {
      new: true,
    })
      .populate("creator", "name")
      .populate("category");

    // send updated service
    return res.status(200).json({
      type: "success",
      message: "service updated successfully",
      data: {
        service: modifyService,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// delete  service by service id
exports.deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.serviceId);

    return res.status(200).json({
      type: "success",
      message: " service deleted succesfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// fetch services name

exports.fetchServiceName = async (req, res, next) => {
  try {
    let { limit } = req.query;
    limit = parseInt(limit);

    const services = await Service.find().select("name").limit(limit);

    return res.status(200).json({
      type: "success",
      message: "fetch services name",
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};
