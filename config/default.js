'use strict'

// 全局配置文件.
module.exports = {
  // HTTP 服务器对外开放端口号.
  server: '3000',
  // MongoDB-jdbc 配置, TODO 目前缺少连接池的配置
  jdbc: {
    username: '',
    password: '',
    url: 'mongodb://localhost:27017/blogs'
  },
  // 密码MD5加密时的盐
  passwordSalt: 'HUWISW2239489',
  // Session 配置
  session: {
    // session 名称
    name: 'SID',
    // cookie 数据加密时的密匙
    secret: 'DEUIH234I23H4UI',
    // cookie 配置
    cookie: {
      // 最大存活时间 两周
      maxAge: 14 * 3600 * 1000,
      // 组织浏览器js查看cookie中的信息,可以防止XSS注入.
      httpOnly: true,
      // 设置cookie的安全性,HTTPS请求为true并且要设置代理.HTTP请求为false.
      secure: false
    }
  }
}
