'use strict'

import mongoose from 'mongoose'
import Sequence from '../controller/common/sequence'

const Schema = mongoose.Schema

const booksModel = new Schema ({
  id: Number, // 主键
  book_name: String, // 文集名称
  book_type: String, // BOOK,TRASH
  book_order: Number, // 排序序号
  create_id: { type: Schema.Types.ObjectId, ref: 'users' }, // 创建人
  create_time: {type: Date, default: Date.now}, // 创建时间
  update_id: { type: Schema.Types.ObjectId, ref: 'users' }, // 修改人(修改人最开始是创建人)
  update_time: {type: Date, default: Date.now}, // 修改时间
  status: {type: Number, default: 1} // 数据状态（1.正常，0.失效）
})

booksModel.index({id: 1})

/* model自定义方法.自定义的方法不是静态的,需要new一个实例后调用.
   还是定义在controller层比较好,这里定义一些复杂的查询?
booksModel.method({
  async initData (user_id) {
    let seq = new Sequence()
    let id = await seq.getId('books')
    let booksData = []
    booksData.push({
      id: id,
      book_name: '文集',
      book_type: 'BOOK',
      user_id: user_id,
      book_order: 1,
      create_id: user_id,
      update_id: user_id
    })
    id = await seq.getId('books')
    booksData.push({
      id: id,
      book_name: "垃圾桶",
      book_type: 'TRASH',
      user_id: user_id,
      book_order: 999999,
      create_id: user_id,
      update_id: user_id
    })
    return mongoose.model('books', booksModel).create(booksData)
  }
})*/

export default mongoose.model('books', booksModel)
