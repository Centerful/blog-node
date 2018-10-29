'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// feeds
const feedsModel = new Schema ({
  id: Number, // 主键
  user_id: Number, // 用户ID
  feed_date: {type: Date, default: Date.now}, // 发布时间
  feed_status: String, // FEED类型:ENCRYPT,PRIVATE,NORMAL
  content: String, // FEED内容
  topic_id: { type: 'ObjectId', ref: 'topics'}, // 参与话题ID
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

feedsModel.index({id: 1})

export default mongoose.model('feeds', feedsModel)
