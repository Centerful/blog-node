'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 博客
const blogsModel = new Schema ({  
  user: { type: Schema.Types.ObjectId, ref: 'users' },  // 博客创建者
  blog_status: { type: String, default: 'DRAFT' },  // 博客状态:DRAFT-草稿,PUBLISH-已发布,TRASH-垃圾桶,DELETED-已删除
  status: { type: Number, default: 1 }, // 数据状态（1.正常，0.失效）
  publish: {
    blog_img: String, // 题图地址
    title: String, // 博客标题
    content: String, // 博客内容
    blog_type: { type: String, default: 'NEW' },  // 博客类型:TOP,HOT,NEW,REP,DEL,NORMAL
    column: { type: Schema.Types.ObjectId, ref: 'columns' },  // 博客发布专栏
    blog_private: { type: Boolean, default: false },  // 是否为私密博客:true,false
    reads: { type: Number, default: 0 },  // 博客阅读数
    comments_count: { type: Number, default: 0 }, // 博客评论数
    thumbs_count: { type: Number, default: 0 }, // 博客点赞数
    tags: [String],
    publish_user: { type: Schema.Types.ObjectId, ref: 'users' }, // 发布人
    publish_time: Date, // 第一次发版时间
    republish_time: Date // 再次发版时间
  },
  write: {
    book: { type: Schema.Types.ObjectId, ref: 'books' },  // 博客所在文集
    blog_img: String, // 题图地址
    title: String, // 博客标题
    content: String, // 博客内容
    blog_order: { type: Number, default: 0 },  // 排序序号,同一文集中的博客
    create_time: { type: Date, default: Date.now },
    write_user: { type: Schema.Types.ObjectId, ref: 'users' }, // 编辑人
    write_time: { type: Date, default: Date.now }
  }
})

blogsModel.index({ id: 1 })

export default mongoose.model('blogs', blogsModel)
