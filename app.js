import express from 'express'
const config = require('config-lite')(__dirname)
import db from './db/db'
import router from './routes/index'
import connectMongo from 'connect-mongo'
import session from 'express-session'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import chalk from 'chalk'


var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// app.use('/public', express.static('public'))

// 设置session.(session与cookie,以及session保存在mongodb中)
const MongoStore = connectMongo(session)
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: new MongoStore({
    url: config.jdbc.url
  })
}))

app.all('*', (req, res, next) => {
  // 全局过滤器
  console.log('')
  console.log(`params: `  + JSON.stringify(req.params))
  console.log(`query: ` + JSON.stringify(req.query))
  console.log(`body: ` + JSON.stringify(req.body))
  console.log(`session: ` + JSON.stringify(req.session))
  /**
   * 设置 请求可以跨域, 如果设置*-也就是全部,那么跨域时是无法携带cookie的,
   * 也就是前端axios不能设置axios.defaults.withCredentials=true
   */
  res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin)
  res.header("Access-Control-Allow-Headers", "content-type")
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
  res.header("Access-Control-Allow-Credentials", true) //可以带cookies
  if (req.method == 'OPTIONS') {
      res.sendStatus(200)
  } else {
      next()
  }
})

/**
 * 请求拦截器
 * 不需要认证: 登录,注册,查看博客,动态等.
 * 游客认证: 点赞,评论与回复.
 * 用户认证: 发表博客,发表动态.
 */
app.use(function(req, res, next) {
  let url = req.url
  // 对url三类请求进行匹配. TODO 
  next()
})

router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(chalk.red(err.stack))
  res.send({
    data: null,
    code: 1,
    message: err.message
  })
})


// module.exports = app
app.listen(config.server, () => {
  console.log(
    chalk.green(`成功监听端口：${config.server}`)
  )
})
