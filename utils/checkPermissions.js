const { unAuthorizedError } = require("../errors");

const checkPermissions = (requestUser, UserId) => {
    if(requestUser.role === "admin") return;
    if(requestUser.userId === UserId.toString()) return;
    throw new unAuthorizedError("You are not authorized to access this route")
}

module.exports = checkPermissions
