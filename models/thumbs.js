'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 点赞
const thumbsModel = new Schema ({
  id: Number, // 主键
  user_id: Number, // 点赞人ID
  relation_id: Number, // 关联ID,blogs,comments,feeds
  relation_type: String, // 关联类型:BLOGS,COMMENTS,FEEDS
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

thumbsModel.index({id: 1})

export default mongoose.model('thumbs', thumbsModel)