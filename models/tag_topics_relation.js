'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 标签
const tagtopicsRelationModel = new Schema ({
  id: Number, // 主键
  tag_topic_id: { type: Schema.Types.ObjectId, ref: 'tagtopics' }, // 标签ID
  relation_id: [{ type: Schema.Types.ObjectId, ref: 'blogs' }, { type: Schema.Types.ObjectId, ref: 'columns' }, { type: Schema.Types.ObjectId, ref: 'feeds' }], // 关联ID
  relation_type: String, // 关联类型:BLOGS,COLUMNS,FEEDS
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

tagTopicsRelationModel.index({id: 1})

export default mongoose.model('tag_topics_relation', tagTopicsRelationModel)
