'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 点赞
const thumbsModel = new Schema ({
  relation: Schema.Types.ObjectId, // 关联ID,blogs,comments,feeds
  relation_type: String, // 关联类型:BLOGS,COMMENTS,FEEDS,USER
  user: { type: Schema.Types.ObjectId, ref: 'users' }, // 点赞用户
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_time: {type: Date, default: Date.now}, // 修改时间
  thumb_status: { type: String, default: 'NORMAL' }, // NORMAL,DELETE
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

thumbsModel.index({id: 1})

export default mongoose.model('thumbs', thumbsModel)
