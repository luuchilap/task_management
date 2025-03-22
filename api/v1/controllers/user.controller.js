const md5 = require('md5');
const User = require('../models/user.model');
const ForgotPassword = require('../models/forgot-password.model');
const generateHelper = require("../../../helpers/generate.js");
const sendMailHelper = require("../../../helpers/sendMail.js");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        return res.json({
            code: 400,
            message: "Email already exists"
        });
    } else{
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generalRandomString(30)
        });
        user.save();

        const token = user.token;
        res.cookie("token", token);
        return res.json({
            code: 200,
            message: "Register success",
            token: token
        });


    }
}

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
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
module.exports.forgotPassword = async (req, res) => {
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

    const timeExpire = 5

    //save data to database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60
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
}
    
// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
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

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "OTP is correct",
        token: token
    })
}

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.cookies.token;
    const password = md5(req.body.password);

    const user = await User.findOne({
        token: token
    });

    if(password === user.password) {
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
    })

    res.json({
        code: 200,
        message: "Reset password success"
    })
};

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
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
}

// [GET] /api/v1/users/list
module.exports.list = async (req, res) => {
    const users = await User.find({
        deleted: false
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Get list user success",
        users: users
    });
}
