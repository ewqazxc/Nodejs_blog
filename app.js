
//应用程序的启动入口文件
 
//加载express模块
var express = require('express');
//创建app应用,相当于nodeJS的http.createService()
var app = express();
 
//1加载模板处理模块
var swig = require('swig');
var mongoose = require('mongoose'); //加载数据库模块
//七
var bodyParser = require('body-parser');//加载body-parser处理post提交的数据
//十
var Cookies = require('cookies'); ;//加载cookies模块
//十一
var User = require('./models/User');//引入模型类
//2配置模板应用模块
//定义当前应用所使用的模板引擎，第一个参数：模板引擎名称，同时也是模板文件的后缀；第二个参数：解析处理模板内容的方法
app.engine('html',swig.renderFile);
//3设置模板文件存放的目录,第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//4注册模板，第一个参数：必须是view engine,第二个参数与定义模板引擎的第一个参数名称一致
app.set('view engine','html');
//6第一次读取会把模板缓存到内存当中，下次会直接读取，因此即使改了模板内容刷新也不会有变化，需要在开发过程中需要取消模板缓存
// 修改模板页面后需刷新页面
swig.setDefaults({cache:false});

//设置静态文件托管 修改刷新
//托管规则：用户发送http请求到后端，后端解析url，找到匹配规则，执行绑定的函数，返回对应的内容，静态文件直接读取制定目录下文件返回给用户，动态文件：处理业务逻辑，加载模板，解析模板返回上数据
app.use('/public',express.static(__dirname + '/public'));//当用户请求的路径ulr以/public开头时，以第二个参数的方式进行处理（直接返回__dirname + '/public'目录下文件）
//七
// app.use(bodyParser.urlencoded());//bodyparser设置 body-parser deprecated undefined extended: provide extended option
app.use(bodyParser.urlencoded({extended:true}));//bodyparser设置

//十
//设置cookie
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res); //调用req的cookies方法把Cookies加载到req对象里面
	req.userInfo = {}; //定义一个全局访问对象
	//如果浏览器请求有cookie信息,尝试解析cookie
	if(req.cookies.get('userInfo')){
		try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //十一
            //获取当前用户登录的类型，是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){
            next();
        }
	}else{
        next();
    }
})

/**
 * [description] 给app绑定首页路由，把一个url路径通过一个或多个方法绑定
 * @param  {[type]} req       request对象，保存客户端请求相关的一些数据
 * @param  {[type]} res       response对象
 * @param  {[type]} next      函数,用于执行下一个和当前路径匹配的函数
 * @return {[type]}           [description]
 */
// app.get('/',function(req,res,next){
//     //res.send(string)发送内容直客户端
//     // res.send('<h1>欢迎来到我的博客！</h1>');
    
//     //5读取views目录下的指定文件，解析并返回给客户端
// 	//第一个参数：模板的文件相对于views/index.html
// 	//第二个参数：传递给模板使用的数据
// 	res.render('index');
// })
 

// 静态文件托管,这种写法不使用
// app.get('/main.css',function(req,res,next){
// 	res.setHeader('content-type','text/css'); //设置内容类型，默认以字符串方式访问
// 	res.send("body {background:gray} h1{color:red}"); //字符串形式的css内容 修改需重启
// })

// 该博客项目的模块分为前台展示，后台管理和API接口三个模块，在app.js里面划分好这些模块，在各自模块进行开发
//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));



mongoose.connect(
    'mongodb://localhost:27017/blog',//url
    { useNewUrlParser: true },//新的解析器
    function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(8081); //监听http请求
        console.log('个人博客-(localhost:8081)');
	}
});

// //监听http请求
// app.listen(8081);
// console.log('监听http请求(8081)');