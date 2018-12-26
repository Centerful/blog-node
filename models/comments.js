'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 评论
const commentsModel = new Schema ({  
  relation: Schema.Types.ObjectId, // 博客,feed的ID
  relation_type: String, // 评论类型:BLOGS,FEEDS
  user: { type: Schema.Types.ObjectId, ref: 'users' }, // 发表评论的用户
  create_time: { type: Date, default: Date.now }, // 发表评论的时间
  update_time: { type: Date, default: Date.now }, // 修改评论的时间
  content: String,
  origin: String, // 第一条评论的_id,第一条评论的origin为空
  reply: String, // comments的_id
  reply_user: { type: Schema.Types.ObjectId, ref: 'users' },
  comment_status: { type: String, default: 'NORMAL' }, // NORMAL,UPDATE,DELETE,FLOD
  thumbs_count: { type: Number, default: 0 },
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

commentsModel.index({id: 1})

export default mongoose.model('comments', commentsModel)
