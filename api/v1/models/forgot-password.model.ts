import mongoose, { Document, Schema } from "mongoose";

interface IForgotPassword extends Document {
    email: string;
    otp: string;
    expireAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const forgotPasswordSchema = new Schema<IForgotPassword>(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180
        }
    }, 
    {
        timestamps: true,
    }
);

const ForgotPassword = mongoose.model<IForgotPassword>('ForgotPassword', forgotPasswordSchema, "forgot-password");

export default ForgotPassword; 