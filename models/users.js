'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 用户
const usersModel = new Schema ({
  id: Number, // 主键
  user_name: String, // 用户账号
  nick_name: String, // 用户昵称
  user_type: String, // NORMAL - 正常用户,VISITOR - 游客.
  password:  String, // 用户密码,加密后的
  email: String, // 用户邮箱
  user_avatar: String, // 用户头像URL
  backdrop_img: String, // 背景图片URL
  gender: String, // 性别:MALE,FEMALE,NULL
  hobby: String, // 爱好
  signature: String, // 用户签名
  introduction: String, // 自我介绍
  resume: String, // 简历
  residence: String, // 居住地
  business: String, // 所在行业
  auth_id: { type: Schema.Types.ObjectId, ref: 'authority' }, // 权限模板ID
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

usersModel.index({id: 1})

export default mongoose.model('users', usersModel)
