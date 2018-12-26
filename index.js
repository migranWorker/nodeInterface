const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const user = require('./router/user');

mongoose.connect('mongodb://localhost:27017/node-token')
        .then(()=>{
            console.log('mongodb connected...');
        })
        .catch(err=>{
            console.log(err);
        })
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //允许的域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");//允许请求的headers类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user',user);





app.listen(3000);
console.log('Server is running ...');
