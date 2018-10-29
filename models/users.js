'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 用户
const usersModel = new Schema ({
  id: Number, // 主键
  user_name: String, // 用户名称
  user_avatar: String, // 用户头像URL
  backdrop_img: String, // 背景图片URL
  gender: String, // 性别:MALE,FEMALE,NULL
  hobby: String, // 爱好
  signature: String, // 用户签名
  introduction: String, // 自我介绍
  resume: String, // 简历
  residence: String, // 居住地
  business: String, // 所在行业
  auth_id: Number, // 权限模板ID
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

usersModel.index({id: 1})

export default mongoose.model('users', usersModel)
