const { ACCESS_DENIED_ERR } = require("../errors");

module.exports = (req, res, next) => {
  const currentUser = res.locals.user;

  if (currentUser.role === "ADMIN" || currentUser.role === "SUPERUSER") {
    next();

    return;
  }
  next({ status: 401, message: ACCESS_DENIED_ERR });
};
