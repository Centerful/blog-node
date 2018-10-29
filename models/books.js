'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const booksModel = new Schema ({
  id: Number, // 主键
  book_name: String, // 文集名称
  user_id: Number, // 文集创建者
  book_order: Number, // 排序序号
  create_id: Number, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: Number, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

booksModel.index({id: 1})

export default mongoose.model('books', booksModel)
