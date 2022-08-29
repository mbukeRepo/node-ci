const {clearCache} = require("../services/cache");
module.exports = (req, res, next) => {
    next();
    console.log("cleaning cache");
    clearCache(req.user.id);
}
