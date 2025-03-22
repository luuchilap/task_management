import { Request, Response, NextFunction } from 'express';
import User from "../models/user.model";

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password");

        if (!user) {
            res.json({
                code: 400,
                message: "Token is invalid"
            });
            return;
        }

        req.user = user;

        next();
    } else {
        res.json({
            code: 400,
            message: "Token is required"
        });
    }
};

export default { requireAuth }; 