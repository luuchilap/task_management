const systemConfig = require("../../../config/system");

const authMiddleware = require('../middlewares/auth.middleware.js');

const taskRoutes = require("./task.route");

const userRoutes = require("./user.route");

module.exports = (app) => {
    const PATH = systemConfig.prefix
    app.use(PATH + "/tasks", authMiddleware.requireAuth, taskRoutes);
    app.use(PATH + "/users", userRoutes);
}