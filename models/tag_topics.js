'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 标签
const tagTopicsModel = new Schema ({
  name: String, // 标签或话题的名称
  type: String, // TAG,TOPIC
  creater: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  updater: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

tagTopicsModel.index({id: 1})

export default mongoose.model('tag_topics', tagTopicsModel)
