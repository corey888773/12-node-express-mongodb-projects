const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }

  try {
    const { name, userId, role } = await isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        `User with role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
