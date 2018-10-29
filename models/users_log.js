'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 用户登录日志
const usersLogModel = new Schema ({
  id: Number, // 主键
  user_id: Number, // 用户id
  create_date: {type: Date, default: Date.now}, // 创建时间
  ipaddress: String, // ip地址
  log_status: String // LOGIN,LOGOUT
})

usersLogModel.index({id: 1})

export default mongoose.model('users_log', usersLogModel)
