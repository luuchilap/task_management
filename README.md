npm init
npm i express
npm i --save-dev nodemon //save-dev for development environment (developers), when deliver to customers, the nodemon is not necessary (because it helps developers re-run the NodeJS project automatically, without having to turn-off the server and re-run)

"scripts": {
            "start": "nodemon --inspect index.js",
            "test": "echo \"Error: no test specified\" && exit 1"
            },

create index.js file, type console.log('OK') to test if it is working

go to the expressjs.com (https://expressjs.com/) and copy this template:

//START TEMPLATE
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//END TEMPLATE

npm i mongoose (to retrieve the database)

create the folder 'config', copy paste the database.js file from other projects (this database.js is true, so just copy then use it)

go to the index.js file, embed the database to connect: (using these 2 lines of code behind)
const database = require('./config/database')
database.connect()

create a '.env' file
npm i dotenv

go to the index.js file, embed the dotenv to connect:
require('dotenv').config();

create a 'models' folder
create a task.model.js file
embed the task.model.js into the index.js file

To render 'deleted: false' tasks, please go to the index.js file -> app.get('/tasks'), type: 

'''
const tasks = await Task.find({
        deleted: false,
});
console.log(tasks);
res.json(tasks); //return the API to the Frontend
'''

To render the detail of one task, please go to the index.js file, add a new URL, and write query instruction:
'''
app.get('/tasks/detail/:id', async (req, res) => {
    const id = req.params.id;
    const task = await Task.find({
        _id: id,
        deleted: false
    res.json(task);
    })
})
'''

when Frontend wanna filter and sort the database, we should config the 'find' variable:
'''
app.get('/api/v1/tasks', async (req, res) => {
    const find = {
        deleted: false
    }

    
    if (req.query.status){
        find.status = req.query.status
    }

    const sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }

    const tasks = await Task.find(find)s.sort(sort);
    res.json(tasks);
})
'''

Để có thể console.log(req.body) mà không bị undefined, cần phải cài thêm body-parser

Mỗi khi muốn sửa dữ liệu trong database hoặc gửi dữ liệu cho backend thì phải thêm Content-Type: application/json trong phần Header trong Postman.

Để có thể gửi được mã OTP cho user trong tính năng quên mật khẩu, cần cài đặt nodemailer (npm i nodemailer)

mongoose: seconds, javascript: miliseconds

npm i --save-dev ts-node: tự động chuyển ts thành js

npm i --save-dev @types/node (chạy được typescript trong nodejs) @types/express(chạy được typescript trong expressjs)