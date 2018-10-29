'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 序列-用于获取id
const sequenceModel = new Schema ({
  authority: Number,
  blogs: Number,
  blogs_his: Number,
  books: Number,
  columns: Number,
  comments: Number,
  feeds: Number,
  messages: Number,
  tag_topics: Number,
  tag_topics_relation: Number,
  thumbs: Number,
  users: Number,
  users_log: Number,
  commons: Number
})

const seq =  mongoose.model('sequence', sequenceModel)

// 进行数据初始化,先查询一次,如果没有查询出数据则,插入一条数据.
seq.findOne((err, data) => {
  if (!data) {
    let newSeq = new seq({
      authority: 0,
      blogs: 0,
      blogs_his: 0,
      books: 0,
      columns: 0,
      comments: 0,
      feeds: 0,
      messages: 0,
      tag_topics: 0,
      tag_topics_relation: 0,
      thumbs: 0,
      users: 0,
      users_log: 0,
      commons: 0
    })
    newSeq.save()
  }
})

export default seq
