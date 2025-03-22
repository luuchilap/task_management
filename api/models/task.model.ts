import mongoose, { Document, Schema } from "mongoose";

interface ITask extends Document {
    title: string;
    status: string;
    content: string;
    timeStart: Date;
    timeFinish: Date;
    createdBy: string;
    listUser: Array<any>;
    taskParentId: string;
    deleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: String,
        status: String,
        content: String,
        timeStart: Date,
        timeFinish: Date,
        createdBy: String,
        listUser: Array,
        taskParentId: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, {
        timestamps: true,
    });

const Task = mongoose.model<ITask>('Task', taskSchema, "tasks");

export default Task; 