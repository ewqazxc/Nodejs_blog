var express = require('express');
var router = express.Router();
var User = require('../models/User');//引入模型类
var Category = require('../models/Category');
var Content = require('../models/Content');
// router.get('/user',function(req,res,next){
// 	res.send('admin-User');
// })
//十二
router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('对不起，只有管理员才可以进入后台管理');
	}else{
        next();
    }
})

//首页
router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
})
//用户管理
router.get('/user', function (req, res) {
    //从数据中读取所有的用户数据
    // User.find().then(function(users){
    //     console.log('users',users)
    // 	res.render('admin/user_index',{
    // 		userInfo:req.userInfo,
    // 		users:users
    // 	});
    // });

    //十四
    //limit()限制获取的用户条数
    //skip()忽略数据的查询
    //count()数据总条数
    var page = Number(req.query.page) || 1;
    var limit = 5;
    var pages = 0;
    // collection.count is deprecated, and will be removed in a future version. Use collection.countDocuments or collection.estimatedDocumentCount instead
    User.estimatedDocumentCount().then(function (count) {//获取数据条数
        //计算总页数向上取整
        pages = Math.ceil(count / limit);
        //page取值不能超过pages，去总页数和page中的最小值
        page = Math.min(page, pages);
        //page取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        //从数据中读取所有的用户数据
        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users);
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            });
        });
    })
})

/**
 * 博客分类的添加
 * 
 * */
//分类管理
router.get(
    '/category',
    (req, res, next) => {
        //十五
        // res.render(
        //     'admin/category_index',
        //     { userInfo: req.userInfo }
        // )

        //十六
        var page = Number(req.query.page) || 1;
        var limit = 2;
        var pages = 0;
        Category.countDocuments().then((count) => {
            pages = Math.ceil(count / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            var skip = (page - 1) * limit;
            Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((categories) => {
                res.render(
                    'admin/category_index', {
                        userInfo: req.userInfo,
                        categories: categories,
                        page: page,
                        count: count,
                        pages: pages,
                        limit: limit
                    }
                )
            })
        })
    }
)
//分类添加
router.get(
    '/category/add',
    (req, res, next) => {
        res.render(
            'admin/category_add',
            { userInfo: req.userInfo }
        )
    }
)
//分类保存
router.post(
    '/category/add',
    (req, res, next) => {
        var name = req.body.name || '';
        if (name == '') {
            res.render(
                'admin/error',
                {
                    userInfo: req.userInfo,
                    message: "名称不能为空"
                }
            );
            return;
        }
        //数据库中是否已经存在同名名称
        Category.findOne({
            name: name
        }).then((data) => {
            if (data) {
                res.render(
                    'admin/error',
                    {
                        userInfo: req.userInfo,
                        message: "已经存在同名名称"
                    }
                );
                return Promise.reject(); //不再执行then方法
            } else {
                return new Category({
                    name: name
                }).save();
            }
        }).then(() => {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '分类保存成功',
                url: '/admin/category'
            })
        })
    }
)
//前往分类修改
router.get(
    '/category/edit',
    (req, res, next) => {
        var id = req.query.id || '';
        Category.findOne({
            _id: id
        }).then((category) => {
            if (!category) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类信息不存在'
                })
            } else {
                res.render('admin/category_edit', {
                    userInfo: req.userInfo,
                    category: category
                })
            }
        }).catch((error) => {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: JSON.stringify(error)
            })
        })
        // res.render('admin/category_edit', {
        //     userInfo: req.userInfo, 
        //     url: '/admin/category'
        // })
    }
)
//分类修改
router.post(
    '/category/edit',
    (req, res, next) => {
        var id = req.query.id || '';
        var name = req.body.name || '';
        Category.findOne({
            _id: id
        }).then((category) => {
            if (!category) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类信息不存在'
                })
            } else {
                if (category.name == name) {
                    res.render('admin/error', {
                        userInfo: req.userInfo,
                        message: '名称未变化',
                        url: '/admin/category'
                    })
                } else {
                    Category.update(
                        { _id: id },
                        { $set: { _id: id, name: name } }
                    ).then((data) => {
                        res.render('admin/success', {
                            userInfo: req.userInfo,
                            message: '修改成功',
                            url: '/admin/category'
                        })
                    })
                }
            }
        }).catch((error) => {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: JSON.stringify(error)
            })
        })
        // res.render('admin/category_edit', {
        //     userInfo: req.userInfo, 
        //     url: '/admin/category'
        // })
    }
)
//分类删除
router.get('/category/delete', function (req, res) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    }).catch((error) => {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: JSON.stringify(error)
        })
    })
})
/**
 * 内容管理
 * 
 * */
//内容首页
router.get(
    '/content',
    (req, res, next) => {
        // res.render('admin/content_index',{
        //     userInfo:req.userInfo, 
        // })
        var page = Number(req.query.page) || 1;
        var limit = 2;
        var pages = 0;
        Content.countDocuments().then(function (count) {
            pages = Math.ceil(count / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            var skip = (page - 1) * limit;
            //populate关联category的信息
            
            // Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate('category').then(function (contents) {
            Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
                res.render('admin/content_index', {
                    userInfo: req.userInfo,
                    contents: contents,
                    page: page,
                    count: count,
                    pages: pages,
                    limit: limit
                });
            });
        })
    }
)
//内容添加
router.get('/content/add', function (req, res) {
    Category.find().sort({ _id: -1 }).then(function (categories) {
        // console.log('类别content/add', categories)
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    })

})
//内容保存
router.post('/content/add', function (req, res) {
    // 验证
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        })
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        })
        return;
    }
    //保存
    new Content({
        category: req.body.category,
        title: req.body.title,
        desc: req.body.desc,
        content: req.body.content,
        addTime: new Date(),
    }).save().then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
        return;
    })
})
//内容修改
router.get('/content/edit', function (req, res) {
    // res.render('admin/content_edit', {
    //     userInfo: req.userInfo,
    // })
    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({ _id: 1 }).then(function (res) {
        categories = res;
        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    })
})
//内容修改保存
router.post('/content/edit', function (req, res) {
    var id = req.query.id || '';
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        })
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        })
        return;
    }
    Content.update({
        _id: id
    }, {
            category: req.body.category,
            title: req.body.title,
            desc: req.body.desc,
            content: req.body.content
        }).then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '内容保存成功',
                url: '/admin/content/edit?id=' + id
            })
        })
})

//内容删除
router.get('/content/delete', function (req, res) {
    var id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    })
})


module.exports = router;