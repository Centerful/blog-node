'use strict'

// 全局配置文件.
// MongoDB数据库连接配置.
module.exports = {
  server: '3000',
  jdbc: {
    username: '',
    password: '',
    url: 'mongodb://localhost:27017/blogs'
  },
  salt: 'HUWISW2239489'
}
