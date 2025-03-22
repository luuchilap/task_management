import { Request, Response } from 'express';
import md5 from 'md5';
import User from '../models/user.model';
import ForgotPassword from '../models/forgot-password.model';
import generateHelper from "../../../helpers/generate";
import sendMailHelper from "../../../helpers/sendMail";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response): Promise<void> => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email already exists"
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generalRandomString(30)
        });
        await user.save();

        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Register success",
            token: token
        });
    }
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        password: password,
        deleted: false
    });
    
    if (!user) {
        res.json({
            code: 400,
            message: "Email is incorrect"
        });
        return;
    }

    if (password !== user.password) {
        res.json({
            code: 400,
            message: "Password is incorrect"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Login success",
        token: token
    });
};

// [POST] /api/v1/users/password/forgot
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email is incorrect"
        });
        return;
    }

    const otp = generateHelper.generalRandomString(8);

    const timeExpire = 5;

    //save data to database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + timeExpire * 60 * 1000)
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    
    //Send OTP via user's email
    const subject = "Reset password";
    const html = `<h1>Your OTP is: ${otp}</h1> <p>OTP will expire in ${timeExpire} minutes</p>`;
    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Forgot password success"
    });
};
    
// [POST] /api/v1/users/password/otp
export const otpPassword = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        res.json({
            code: 400,
            message: "OTP is incorrect"
        });
        return;
    }

    const user = await User.findOne({
        email: email
    });

    if (!user) {
        res.json({
            code: 400,
            message: "User not found"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "OTP is correct",
        token: token
    });
};

// [POST] /api/v1/users/password/reset
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token;
    const password = md5(req.body.password);

    const user = await User.findOne({
        token: token
    });

    if (!user) {
        res.json({
            code: 400,
            message: "User not found"
        });
        return;
    }

    if (password === user.password) {
        res.json({
            code: 400,
            message: "New password must be different from old password"
        });
        return;
    }
    
    await User.updateOne({
        token: token,
    }, {
        password: password
    });

    res.json({
        code: 200,
        message: "Reset password success"
    });
};

// [GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token;

    const user = await User.findOne({
        token: token,
        deleted: false
    }).select("-password -token");

    res.json({
        code: 200,
        message: "Get user detail success",
        info: user
    });
};

// [GET] /api/v1/users/list
export const list = async (req: Request, res: Response): Promise<void> => {
    const users = await User.find({
        deleted: false
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Get list user success",
        users: users
    });
};

export default {
    register,
    login,
    forgotPassword,
    otpPassword,
    resetPassword,
    detail,
    list
}; 