var express = require('express');
var router = express.Router();
//八
var User = require('../models/User');//引入模型类
var Content = require('../models/Content');
// router.get('/user',function(req,res,next){
// 	res.send('api-User');
// })
 
//七
//定义返回变量格式
var resData;
router.use(function(req,res,next){
	resData = {
		code:0,
		message:''
	};
	next();
})
//注册逻辑 S
router.post('/user/register',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;
	//用户名不能空
	if(username == ''){
		resData.code = 1;
		resData.message = '用户名不能为空';
		res.json(resData); //使用res.json的方法返回前端数据
		return;
	}
	//密码不能为空
	if(password == ''){
		resData.code = 2;
		resData.message = '密码不能为空';
		res.json(resData);
		return;
	}
	//两次密码不能不一样
	if(password != repassword){
		resData.code = 3;
		resData.message = '两次输入的密码不一致';
		res.json(resData);
		return;
	}
 
	// resData.message = '注册成功';
    // res.json(resData);

    //八
    //验证用户名是否已经注册，需要通过模型类查询数据库
    // User.find({//查询全部
	// 	passWord:'123'
	// }).then((res)=>{
    // })
	User.findOne({//查询第一条
		userName:username
	}).then(function(userInfo ){
		// console.log(userInfo); //若控制台返回空表示没有查到数据
		if(userInfo){
			//若数据库有该记录
			resData.code = 4;
			resData.message = '用户名已被注册';
			resData.userInfo = userInfo;
			res.json(resData);
			return;
		}
		//用户名没有被注册则将用户保存在数据库中
		var user = new User({
			userName:username,
			passWord:password
		});//通过操作对象操作数据库
		return user.save();
	}).then(function(newUserInfo){
		resData.message = '注册成功';
		res.json(resData);
	});
})
//注册逻辑 E

//登录逻辑 S
router.post(
    '/user/login',
    (req,res,next)=>{
        var userName = req.body.username;
        var passWord = req.body.password;
        //用户名或密码不能为空
        if(userName==''||passWord==''){
            resData.code = 1;
            resData.message = '用户名或密码不能为空';
            res.json(resData);
            return;
        }
        //数据库验证用户名密码
        User.findOne({
            userName:userName,
            passWord:passWord,
        }).then((userInfo)=>{
            if(!userInfo){
                resData.code = 2;
                resData.message = '用户名或密码错误';
                res.json(resData);
                return;
            }
            //验证通过则登录
            resData.message = '登录成功';
            resData.userInfo = {
                userId: userInfo._id,
                userName: userInfo.userName
            };
            //十
            //使用req.cookies的set方法把用户信息发送cookie信息给浏览器，浏览器将cookies信息保存，再次登录浏览器会将cookies信息放在头部发送给你服务端，服务端验证登录状态
            // req.cookies.set('userInfo',JSON.stringify(resData.userInfo));
            req.cookies.set('userInfo',JSON.stringify({
                _id: userInfo._id,
                username: userInfo.userName
            }));

            
            res.json(resData);
            return;
        })
    }
)
//登录逻辑 E
//注销 S
router.get(
    '/user/logout',
    (req,res,next)=>{
        req.cookies.set('userInfo',);
        res.json(resData);
        // return;
    }
)
//注销 E
//是否管理员 S
router.post(
    '/user/setAdmin',
    (req,res,next)=>{
        var userName = req.body.userName;
        var isAdmin = req.body.isAdmin;
        User.update(
            {userName:userName},
            {$set:{userName:userName,isAdmin:isAdmin=='true'?false:true}}
        ).then((data)=>{
            res.json(resData);
        })
    }
)
//是否管理员 E

//评论提交 S
router.post('/comment/post',function(req,res){
	//内容的id
    var contentid = req.body.contentid || '';
	var postData = {
		userName:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content
	}
	//查询当前这边内容的信息
	Content.findOne({
		_id:contentid
	}).then(function(content){
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent){
		resData.message = '评论成功';
		resData.data = newContent,
		res.json(resData);
	});
})
//评论提交 E
//获取所有评论 S
router.get('/comment',function(req,res){
	//内容的id
    var contentid = req.query.contentid || '';
	//查询当前这边内容的信息
	Content.findOne({
		_id:contentid
	}).then(function(content){ 
		resData.message = '查询全部评论成功';
		resData.data = content.comments,
		res.json(resData);
	});
})
//获取所有评论 E

module.exports = router;