const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (
    requestUser.role !== "admin" &&
    requestUser.userId !== resourceUserId.toString()
  ) {
    throw new CustomError.UnauthorizedError(
      "You are not authorized to perform this action"
    );
  }
};

module.exports = checkPermissions;
