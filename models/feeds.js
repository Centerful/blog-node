'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// feeds
const feedsModel = new Schema ({
  feed_date: {type: Date, default: Date.now}, // 发布时间
  feed_status: { type: String, default: 'NORMAL' }, // FEED类型:ENCRYPT,PRIVATE,NORMAL
  content: String, // FEED内容
  images: [String], // 图片
  videos: [String], // 视频 目前不会用到
  topic: [String], // 参与话题ID
  comments_count: { type: Number, default: 0 }, // 评论数
  thumbs_count: { type: Number, default: 0 }, // 点赞数
  user: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

feedsModel.index({id: 1})

export default mongoose.model('feeds', feedsModel)
