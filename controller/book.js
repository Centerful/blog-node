'use strict'

import Base from './common/base'
import books from '../models/books'
import blogs from '../models/blogs'
import booksData from '../models/mock/books-data'

class Book extends Base {
  constructor(){
    super()
    this.getBooks = this.getBooks.bind(this)
    this.initData = this.initData.bind(this)
    this.getBookBlogs = this.getBookBlogs.bind(this)
    this.addBook = this.addBook.bind(this)
    this.getBookRename = this.getBookRename.bind(this)
    this.deleteBook = this.deleteBook.bind(this)
  }
  /**
   * 用户获得自己的books信息.
   */
  async getBooks (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error("用户登录后才能进行此操作")
    }
    let booksData = await books.find({ creater: req.session.user_id })
    // 该用户没有books,进行初始化.
    if (!booksData || booksData.length == 0) {
      booksData = await this.initData(req.session.user_id)
      console.log("booksData: " + JSON.stringify(booksData))
    }
    // 将_id值替换到id上。
    res.send(this.succ('', booksData))
  }
  /**
   * 第一次登录的用户进行数据初始化.
   */
  async initData (user_id) {
    let booksData = []
    booksData.push({
      book_name: '文集',
      book_type: 'BOOK',
      book_order: 1,
      creater: user_id,
      updater: user_id
    })
    booksData.push({
      book_name: "垃圾桶",
      book_type: 'TRASH',
      book_order: 999999,
      creater: user_id,
      updater: user_id
    })
    return books.create(booksData)
  }
  async getBookBlogs (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error("用户登录后才能进行此操作")
    }
    // 查询当前文集,当前用户下博客,不查询content字段(太长)
    let blogsData = await blogs.find({book: req.params.id, creater: req.session.user_id}, {content: 0})
    res.send(this.succ('', blogsData))
  }
  /**
   * 添加book。
   */
  async addBook (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error("用户登录后才能进行此操作")
    }
    // 获得min order -1
    let minBook = await books.findOne({}).sort({"book_order": 1}).limit(1)
    let order = minBook.book_order - 1
    let { session: {user_id}, body: {book_name} } = req
    let booksData = {
      book_name: book_name,
      book_type: 'BOOK',
      book_order: order,
      creater: user_id,
      updater: user_id
    }
    booksData = await books.create(booksData)
    res.send(this.succ('', booksData))
  }
  async reorder (req, res, next) {

  }
  async getBookRename (req, res, next) {
    
  }
  async deleteBook (req, res, next) {
    
  }
}

export default new Book()
