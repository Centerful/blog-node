'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const blogsHisModel = new Schema ({
  id: Number, // 主键
  blog_id: { type: Schema.Types.ObjectId, ref: 'blogs' }, // 博客表id
  blog_img: String, // 题图地址
  title: String, // 博客标题
  content: String, // 博客内容
  his_date: {type: Date, default: Date.now}, // 历史数据保存时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

blogsHisModel.index({id: 1})

export default mongoose.model('blogshis', blogsHisModel)
