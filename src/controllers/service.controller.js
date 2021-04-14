const { DEFAULT_NO_IMG } = require("../constant");
const { ACCESS_DENIED_ERR, SERVICE_NOT_FOUND_ERR } = require("../errors");

const Service = require("../models/service.model");

// ------------------------------------

// feth all services
exports.fetchAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    return res.status(200).json({
      type: "success",
      message: "fetch all services",
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------

// fetch  service by service id

exports.fetchServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId);
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

// ------------------------------------

// create new service

exports.createService = async (req, res, next) => {
  try {
    let { name, description, image, category } = req.body;
    const currentUser = res.locals.user;

    image = image ? image : DEFAULT_NO_IMG;

    const newService = new Service({
      name,
      description,
      image,
      creator: currentUser._id,
      category,
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
    const { serviceId } = req.params;

    let { name, description, image, category } = req.body;

    image = image ? image : DEFAULT_NO_IMG;

    const currentUser = res.locals.user;

    const service = await Service.findById(serviceId);

    if (!service) {
      next({ status: 404, message: SERVICE_NOT_FOUND_ERR });
      return;
    }

    // only service creator can modify data

    if (service.creator.toString() !== currentUser._id.toString()) {
      next({ status: 401, message: ACCESS_DENIED_ERR });
      return;
    }

    // finally update service

    const modifyService = await Service.findByIdAndUpdate(
      serviceId,
      {
        name,
        description,
        image,
        category,
      },
      { new: true }
    );

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
    const { serviceId } = req.params;
    const currentUser = res.locals.user;
    const service = await Service.findById(serviceId);

    if (!service) {
      next({ status: 404, mesage: SERVICE_NOT_FOUND_ERR });
      return;
    }

    // only creator can delete their service
    if (service.creator.toString() !== currentUser._id.toString()) {
      next({ status: 401, message: ACCESS_DENIED_ERR });
      return;
    }

    // finally delete

    await service.delete();

    return res.status(200).json({
      type: "success",
      message: " service deleted succesfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
