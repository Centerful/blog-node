'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 标签
const tagTopicsModel = new Schema ({
  id: Number, // 主键
  name: String, // 标签或话题的名称
  type: String, // TAG,TOPIC
  create_id: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

tagTopicsModel.index({id: 1})

export default mongoose.model('tag_topics', tagTopicsModel)
