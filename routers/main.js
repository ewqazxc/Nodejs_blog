var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content')

//二十三
var data;
//处理通用的数据
router.use(function(req,res,next){
	data = {
		userInfo:req.userInfo,
		categories:[]
	};
	Category.find().sort({_id:-1}).then(function(categories){
		data.categories = categories;
		next();
	})
})

// router.get('/user',function(req,res,next){
//     res.send('main-首页');
// })
router.get('/',function(req,res,next){ 
    // res.render('main/index.html');

	// res.render(
    //     'main/index.html',
    //     {
    //         userInfo:req.userInfo
    //     }
    //     );

    //十七 类别
    // Category.find().sort({_id:-1}).then((categories)=>{
    //     res.render(
    //         'main/index', {
    //             userInfo: req.userInfo,
    //             categories: categories, 
    //         }
    //     )
    // })


    //二十一 类别+内容
    // var data = {
	// 	userInfo:req.userInfo,
	// 	categories:[],
	// 	page:Number(req.query.page) || 1,
	// 	limit:3,
	// 	pages:0,
	// 	count:0
	// };
	// //读取所有的分类信息
	// Category.find().sort({_id:-1}).then(function(categories){
	// 	data.categories = categories;
	// 	//读取内容总记录数
	// 	return Content.count();
	// }).then(function(count){
	// 	data.count = count;
	// 	//计算总页数向上取整
	// 	data.pages = Math.ceil(data.count / data.limit);
	// 	//page取值不能超过pages，去总页数和page中的最小值
	// 	data.page = Math.min(data.page,data.pages);
	// 	//page取值不能小于1
	// 	data.page = Math.max(data.page,1);
	// 	var skip = (data.page -1 ) * data.limit;
	// 	//读取内容,最新的展示在最前面
	// 	return Content.find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({
	// 		addTime:-1
	// 	});
	// }).then(function(contents){
	// 	data.contents = contents; //将内容赋值给data属性
	// 	console.log('首页data',data);
	// 	res.render('main/index',data);
    // })
    
    //二十二 类别+内容+分类展示
    // var data = {
	// 	userInfo:req.userInfo,
	// 	category:req.query.category || '',
	// 	categories:[],
	// 	page:Number(req.query.page) || 1,
	// 	limit:2,
	// 	pages:0,
	// 	count:0
	// };
	// var where = {};
	// if(data.category){
	// 	where.category = data.category;
	// }
	// Category.find().sort({_id:-1}).then(function(categories){
	// 	data.categories = categories;
	// 	return Content.where(where).count();
	// }).then(function(count){
	// 	data.count = count;
	// 	data.pages = Math.ceil(data.count / data.limit);
	// 	data.page = Math.min(data.page,data.pages);
	// 	data.page = Math.max(data.page,1);
	// 	var skip = (data.page -1 ) * data.limit;
	// 	return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
	// 		addTime:-1
	// 	});
	// }).then(function(contents){
	// 	data.contents = contents; //将内容赋值给data属性
	// 	console.log('首页data',data);
	// 	res.render('main/index',data);
    // })
    
    //二十三
    data.category = req.query.category || '';
	data.page = Number(req.query.page) || 1;
	data.limit = 2;
	data.pages = 0;
	data.count = 0;
	var where = {};
	if(data.category){
		where.category = data.category;
	}
	//读取内容
	Content.where(where).countDocuments().then(function(count){
		data.count = count;
		data.pages = Math.ceil(data.count / data.limit);
		data.page = Math.min(data.page,data.pages);
		data.page = Math.max(data.page,1);
		var skip = (data.page -1 ) * data.limit;
		return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
			addTime:-1
		});
	}).then(function(contents){
		data.contents = contents; //将内容赋值给data属性
		// console.log('首页data',data);
		res.render('main/index',data);
	})
})

//阅读全文 增减阅读量
router.get('/view',function(req,res){
	var contentid = req.query.contentid || '';
	Content.findOne({
		_id:contentid
	}).then(function(content){
        // console.log('阅读全文-content',content)
		data.content = content;
        content.views ++ ; //阅读量增加 
		content.save(); //保存阅读量
		res.render('main/view',data)
	})
}) 
module.exports = router;