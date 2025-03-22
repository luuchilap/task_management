import { Request, Response } from 'express';
import Task from '../models/task.model';
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

interface TaskQuery {
    status?: string;
    keyword?: string;
    page?: string;
    limit?: string;
    sortKey?: string;
    sortValue?: string;
}

// Extend Express Request to include user property
declare module 'express' {
    interface Request {
        user?: any;
    }
}

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
    const find: any = {
        $or:[
            { createdBy: req.user?.id },
            { listUser: req.user?.id }
        ],
        deleted: false
    };

    if (req.query.status){
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query as TaskQuery);

    if (req.query.keyword){
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Task.countDocuments(find);
    let initialPagination = {
        currentPage: 1,
        limitItems: 4,
        skip: 0,
        totalPage: 0
    };
    
    let objectPagination = paginationHelper(
        initialPagination,
        req.query as TaskQuery,
        countProducts
    );
    // End Pagination

    //Sort
    const sort: Record<string, any> = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey as string] = req.query.sortValue;
    }
    //End Sort
    
    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const task = await Task.find({
        _id: id,
        deleted: false
    });
    res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        const status = req.body.status;
    
        await Task.updateOne({
            _id: id
        }, {
            status: status
        });
    
        res.json({
            code: 200,
            message: "Update status success"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Not defined"
        });
    }  
};

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async(req: Request, res: Response): Promise<void> => {
    try{
        const { ids, key, value } = req.body;
        
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Update status success"
                });
                break;
            
            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: value,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Update deleted success"
                });
                break;
            
            default:
                res.json({
                    code: 400,
                    message: "Not defined"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Not defined"
        });
    }
};

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response): Promise<void> => {
    try{
        req.body.createdBy = req.user?.id;

        const task = new Task(req.body);
        const data = await task.save();
        
        res.json({
            code: 200,
            message: "Create success",
            data: data
        });
    } catch(error){
        res.json({
            code: 400,
            message: "Not defined"
        });
    }
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        const data = req.body;
        await Task.updateOne({
            _id: id
        }, data);
        res.json({
            code: 200,
            message: "Update success"
        });
    } catch(error){
        res.json({
            code: 400,
            message: "Not defined"
        });
    }
};

// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true
        });
        res.json({
            code: 200,
            message: "Delete success"
        });
    } catch(error){
        res.json({
            code: 400,
            message: "Not defined"
        });
    }
};

export default {
    index,
    detail,
    changeStatus,
    changeMulti,
    create,
    edit,
    delete: deleteTask
}; 