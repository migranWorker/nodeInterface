const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//注册接口
router.post('/register',(req,res)=>{
    User.findOne({userNum:req.body.userNum})
        .then(user=>{
            if(user){
                res.json({"error":"该用户已存在"});
            }else{
                bcrypt.genSalt(10, function(err, salt) { //10是等级的意思
                    bcrypt.hash(req.body.userPsd, salt, function(err, hash) { //第一个参数是加密的内容
                        // Store hash in your password DB.
                        if(err) throw err;
                        let newUser = new User({
                            userNum:req.body.userNum,
                            userName:req.body.userName,
                            userPsd:hash
                        })
                        User(newUser).save()
                                     .then(()=>{
                                         res.json({"success":"注册成功"});
                                     })
                                     .catch(err=>{
                                         console.log(err);
                                     })
                    });
                });
            }
        })
})


//登录接口
router.post('/login',(req,res)=>{
    User.findOne({userNum:req.body.userNum})
        .then(use=>{
            if(!use){
                res.json({"error":"没有该用户"});
            }else{
                bcrypt.compare(req.body.userPsd, use.userPsd)
                      .then(isMatch=>{
                          if(isMatch){
                              const token = jwt.sign({
                                userNum:req.body.userNum,
                                userPsd:req.body.userPsd
                                },'my_token',{expiresIn:'120s'});
                              res.json({"success":"登陆成功","token":token});
                          }else{
                              res.json({"error":"密码错误"});
                          }
                      })
            }
        })
})

//我的页面的接口

router.get('/mine',(req,res)=>{
    const token = req.query.token;
    if(token){
        jwt.verify(token, 'my_token', (error, decoded) => {
                //第一个参数是错误信息 第二个参数是解密之后的token信息是一个对象
            if (error) {
                res.json({"error":"登录过时，请重新登陆！"});
                return;
            }else{
                // console.log(decoded); //在这里验证token时效的时候，将当前的时间/1000向下取整
                    User.findOne({userNum:decoded.userNum})
                        .then(use=>{
                            if(use){
                                res.json({"data":use});
                            }else{
                                res.json({"error":"该用户已被冻结"});
                            }
                        })
                }
            })
    }else{
        res.json({"error":"没有token"});
    }
})



module.exports = router;