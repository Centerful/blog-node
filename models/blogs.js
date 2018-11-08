'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 博客
const blogsModel = new Schema ({
  id: Number,  // 主键
  blog_img: String,  // 题图地址
  user_id: { type: Schema.Types.ObjectId, ref: 'users' },  // 博客创建者
  title: String,  // 博客标题
  content: String,  // 博客内容
  blog_status: {type: String, default: 'DRAFT'},  // 博客状态:DRAFT-未发布,PUBLISH-已发布,DELETE-已删除
  blog_type: {type: String, default: 'NEW'},  // 博客类型:TOP,HOT,NEW,REP,DEL,NORMAL
  blog_private: Number,  // 是否为私密博客:1.是,2.否
  columns_id: { type: Schema.Types.ObjectId, ref: 'columns' },  // 博客发布专栏
  books_id: { type: Schema.Types.ObjectId, ref: 'books' },  // 博客所在文集
  reads: Number,  // 博客阅读数
  blog_order: Number,  // 排序序号,同一文集中的博客
  create_id: { type: Schema.Types.ObjectId, ref: 'users' },  // 创建人
  create_time: {type: Date, default: Date.now},  // 创建时间
  update_id: { type: Schema.Types.ObjectId, ref: 'users' },  // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now},  // 修改时间
  status: {type: Number, default: 1}  // 数据状态（1.正常，0.失效）
})

blogsModel.index({id: 1})

export default mongoose.model('blogs', blogsModel)
