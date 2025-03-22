const express = require('express')
const database = require('./config/database')
const systemConfig = require('./config/system')
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
database.connect()

const app = express()
const port = process.env.PORT
const routeApiVer1 = require('./api/v1/routes/index.route')

app.locals.prefix = systemConfig.prefix;

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors())

routeApiVer1(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})