'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 评论
const commentsModel = new Schema ({
  id: Number, // 主键
  user_id: Number, // 评论用户id
  relation_id: Number, // 评论类型:BLOGS,FEEDS
  relation_type: String, // 博客,feed的ID
  comment_date: {type: Date, default: Date.now},, // 评论时间
  content: String, // 评论内容
  reply_id: Number, // 回复评论ID
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

commentsModel.index({id: 1})

export default mongoose.model('comments', commentsModel)
