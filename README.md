# Blog-node

> A blog,back-end project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start dev
```

# 目录结构
- Controller->类似servlet中的controller,可以直接在controller中写处理逻辑(service中的),也可以在开个service层.
- Base->通用的controller组件,比如评论与点赞的某些方法很多地方都会用到所以单独抽出一个实现层.
- common->通用方法,工具方法等.
- Utils->redis连接服务，缓存组件，日志组件等
- Models->数据模型,类似Bean对象有字段声明,不过该对象还是mongoose的schema具有MongoDB所支持的sql语法,find,findById,findOne,save,remove,update,updateOne,count等
- Middlewares->中间件,类似servlet中的过滤器,一般用作权鉴,登录,xss特殊字符过滤用,请求日志记录等.
- DB,db.js-连接MongoDB数据库.
- Public->静态资源文件(css,js,img等),前端单页应用将webpack输出的production都放在此目录中.
- Views->后端模板引擎文件.ejs,jade等.类似jsp.
- Router->模块化路由,将每个请求路由到Controller的函数中.
- App.js->添加中间件,添加路由,express等,监听端口启动服务器.
- Log->日志处理类.
- Test->单元测试类

# 知识点
- node.js特性.
- Express框架api
- ES6特性:Js Class定义constructor等,Async,Await,Promise等
- mongoose-lib,连接node与MongoDB.
- cookie,session解析中间件,config中间件.
- express对RESTful的支持程度,GET/POST/PUT/DELETE请求,URL后边跟着参数,body的form-data(文件上传时),x-www-form-urlencoded(普通post请求),raw(text,json(json格式的ajax请求),xml,html),RESTful-URL上的参数(/user/123/books/222).
- req.params获得RESTful-URL上参数,req.query获得URL-?后面的参数,req.body获得请求中Body里的参数,解析x-www-form-urlencoded,json需要bodyparser中间件,解析multipart/form-data需要multer中间件.
- GET请求,query,params
- POST,PUT,PATCH,DELETE请求,query,params,body(x-www...,raw可以,form-data与binary需要multer)

# TODO-LIST
- [ ] 先快速开发基础功能,等到基础功能开发的差不多了,在完善日志/异常等功能(这些功能可以参考全球资金项目).
- 需要配置的功能:
    + [ ] controller层的异常,在返回时进行统一拦截与封装.
    + [ ] 自定义异常,封装异常码与异常信息.
    + [ ] 在controller层进行日志收集
    + [ ] 定义统一的ajax数据返回的格式.
    + [ ] 静态资源统一路由.
    + [ ] 文件与图片上传
    + [ ] jdbc连接池
    + [ ] 了解mongodb不支持事务会造成什么影响.
    + [ ] OAuth2.0
    + [ ] XSS过滤.
    + [ ] controller入参对象,需要经过非空校验.写个copy(拷贝时只给目标对象存在的属性赋值)-validate的插件(非空,类型,长度,数值范围等.).
    + [ ] 统一的控制台提示方法.
    + [ ] express-session的使用.
    + [ ] 添加node-热部署.

# 后端项目注意事项
- [ ] request的路由
- [ ] session,cookie的parser
- [ ] 跨域请求控制
- [ ] request请求权限控制(用户是否有权限进行该操作)
- [ ] request请求参数校验.
- [ ] sso(单点登录,登录)模块
- [ ] 