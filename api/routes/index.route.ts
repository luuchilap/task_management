import { Express } from 'express';
import systemConfig from "../../config/system";
import authMiddleware from '../middlewares/auth.middleware';
import taskRoutes from "./task.route";
import userRoutes from "./user.route";

const routes = (app: Express): void => {
    const PATH = systemConfig.prefix;
    app.use(PATH + "/tasks", authMiddleware.requireAuth, taskRoutes);
    app.use(PATH + "/users", userRoutes);
};

export default routes; 