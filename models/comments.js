'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 评论
const commentsModel = new Schema ({
  relation: [{ type: Schema.Types.ObjectId, ref: 'blogs' }, { type: Schema.Types.ObjectId, ref: 'feeds' }], // 博客,feed的ID
  relation_type: String, // 评论类型:BLOGS,FEEDS
  comment_date: {type: Date, default: Date.now},, // 评论时间
  content: String, // 评论内容
  reply: { type: Schema.Types.ObjectId, ref: 'comments' }, // 回复评论ID
  creater: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  updater: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

commentsModel.index({id: 1})

export default mongoose.model('comments', commentsModel)
