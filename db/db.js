'use strict'

import mongoose from 'mongoose'
import chalk from 'chalk'
const config = require('config-lite')(__dirname)

// debug 模式
mongoose.set('debug', true)
// 使用 Node 自带 Promise 代替 mongoose 的 Promise
mongoose.Promise = global.Promise
// 配置mongoose options
function mongoOptions () {
  let options = {
    poolSize: 5,
    reconnectTries: 100,
    keepAlive: 120
  }
  return options
}

// 连接MongoDB数据库
mongoose.connect(config.jdbc.url, mongoOptions())

const db = mongoose.connection

db.once('open' ,() => {
  console.log(
    chalk.green('连接数据库成功')
  )
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    )
    mongoose.disconnect()
})

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    )
    mongoose.connect(config.url, {server:{auto_reconnect:true}})
})

export default db
