import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    token?: string;
    deleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, {
        timestamps: true,
    });

const User = mongoose.model<IUser>('User', userSchema, "users");

export default User; 