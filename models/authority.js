'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 权限 TODO 字段还未定义好
const messagesModel = new Schema ({
  id: Number,
  content: String,
  create_id: { type: Schema.Types.ObjectId, ref: 'users' },
  create_time: {type: Date, default: Date.now},
  update_id: { type: Schema.Types.ObjectId, ref: 'users' },
  update_time: {type: Date, default: Date.now},
  status: {type: Number, default: 1}
})

messagesModel.index({id: 1})

export default mongoose.model('messages', messagesModel)
