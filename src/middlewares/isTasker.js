const { ACCESS_DENIED_ERR } = require("../errors");

module.exports = (req, res, next) => {
  const currentUser = res.locals.user;

  if (currentUser.role === "TASKER" || currentUser.role === "SUPERUSER") {
    return next();
  }
  next({ status: 401, message: ACCESS_DENIED_ERR });
};
