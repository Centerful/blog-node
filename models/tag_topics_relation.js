'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 标签
const tagtopicsRelationModel = new Schema ({
  id: Number, // 主键
  tag_topic_id: Number, // 标签ID
  relation_id: Number, // 关联ID
  relation_type: String, // 关联类型:BLOGS,COLUMNS
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

tagTopicsRelationModel.index({id: 1})

export default mongoose.model('tag_topics_relation', tagTopicsRelationModel)
