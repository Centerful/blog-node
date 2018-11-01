'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 专栏
const columnsModel = new Schema ({
  id: Number, // 主键
  column_name: String, // 专栏名称
  column_img: String, // 专栏配图
  column_status: String, // 专栏状态:OPEN,CLOSE
  introduction: String, // 专栏介绍
  user_id: Number, // 专栏创建人
  blog_count: Number, // 专栏博客数量
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

columnsModel.index({id: 1})

export default mongoose.model('columns', columnsModel)