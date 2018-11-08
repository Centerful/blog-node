'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// feeds
const feedsModel = new Schema ({
  feed_date: {type: Date, default: Date.now}, // 发布时间
  feed_status: String, // FEED类型:ENCRYPT,PRIVATE,NORMAL
  content: String, // FEED内容
  topic: { type: Schema.Types.ObjectId, ref: 'tagtopics' }, // 参与话题ID
  creater: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  updater: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

feedsModel.index({id: 1})

export default mongoose.model('feeds', feedsModel)
