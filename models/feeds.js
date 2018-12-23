'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// feeds
const feedsModel = new Schema ({
  feed_date: {type: Date, default: Date.now}, // 发布时间
  feed_status: String, // FEED类型:ENCRYPT,PRIVATE,NORMAL
  content: String, // FEED内容
  images: [String], // 图片
  videos: [String], // 视频 目前不会用到
  topic: [String], // 参与话题ID
  comments_count: { type: Number, default: 0 }, // 评论数
  comments: [{
    _id: String, // 唯一标识
    origin: String, // 第一条评论的_id
    user: { type: Schema.Types.ObjectId, ref: 'users' }, // 发表评论的用户
    create_time: { type: Date, default: Date.now }, // 发表评论的时间
    update_time: Date, // 修改评论的时间
    content: String,
    reply: String, // comments
    reply_user: { type: Schema.Types.ObjectId, ref: 'users' },
    comment_status: { type: String, default: '' }, // NORMAL,UPDATE,DELETE,FLOD
    thumbs_count: { type: Number, default: 0 },
    thumbs: [{ type: Schema.Types.ObjectId, ref: 'users' }], // 点赞用户
  }],
  thumbs_count: { type: Number, default: 0 }, // 点赞数
  thumbs: [{ 
    user: { type: Schema.Types.ObjectId, ref: 'users' }, // 点赞的用户
    create_time: { type: Date, default: Date.now }, // 点赞的时间
  }], // 点赞信息
  creater: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  updater: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

feedsModel.index({id: 1})

export default mongoose.model('feeds', feedsModel)
