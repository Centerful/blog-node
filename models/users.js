'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 用户
const usersModel = new Schema ({
  user_name: String, // 用户账号
  nick_name: String, // 用户昵称
  user_type: String, // NORMAL - 正常用户,VISITOR - 游客.
  password:  String, // 用户密码,加密后的
  email: String, // 用户邮箱
  user_avatar: {type: String, default: 'http://localhost:3000/public/images/default_user_avater.jpg'}, // 用户头像URL
  backdrop_img: String, // 背景图片URL
  gender: String, // 性别:MALE,FEMALE,NULL
  hobby: String, // 爱好
  signature: {type: String, default: '这个人比较懒什么都没写...'}, // 用户签名
  introduction: String, // 自我介绍
  resume: String, // 简历
  residence: String, // 居住地
  business: String, // 所在行业
  authority: { type: Schema.Types.ObjectId, ref: 'authority' }, // 权限模板ID
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

usersModel.index({id: 1})

export default mongoose.model('users', usersModel)
