const Task = require('../models/task.model')
const paginationHelper = require("../../../helpers/pagination.js");
const searchHelper = require("../../../helpers/search.js");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    // const find = {
    //     deleted: false
    // }
    const find = {
        $or:[
            { createdBy: req.user.id },
            { listUser: req.user.id }
        ],
        deleted: false
    }
    if (req.query.status){
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query);

    if (req.query.keyword){
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Task.countDocuments(find); //tat ca nhung doan truy van vao databse thif phair dungf await
    let initialPagination = {
        currentPage: 1,
        limitItems: 4
    }
    let objectPagination = paginationHelper(
        initialPagination,
        req.query,
        countProducts
      );
    // End Pagination

    

    //Sort
    const sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    //End Sort
    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // const tasks = await Task.find(find).select("title status timeStart time")
    res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const task = await Task.find({
        _id: id,
        deleted: false
    })
    res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
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
module.exports.changeMulti = async(req, res) => {
    try{
        const { ids, key, value} = req.body;
        console.log(ids, key, value);
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
                })
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
                })
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
module.exports.create = async (req, res) => {
    try{
        req.body.createdBy = req.user.id;

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
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
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
module.exports.delete = async (req, res) => {
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