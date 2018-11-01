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
    let booksData = await books.find({ user_id: req.session.user_id })
    // 该用户没有books,进行初始化.
    if (!booksData || booksData.length == 0) {
      booksData = await this.initData(req.session.user_id)
      console.log("booksData: " + JSON.stringify(booksData))
    }
    res.send(this.succ('', booksData))
  }
  /**
   * 第一次登录的用户进行数据初始化.
   */
  async initData (user_id) {
    let id = await this.getId('books')
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
    id = await this.getId('books')
    booksData.push({
      id: id,
      book_name: "垃圾桶",
      book_type: 'TRASH',
      user_id: user_id,
      book_order: 999999,
      create_id: user_id,
      update_id: user_id
    })
    return books.create(booksData)
  }
  async getBookBlogs (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error("用户登录后才能进行此操作")
    }
    // 查询当前文集,当前用户下博客,不查询content字段(太长)
    let blogsData = await blogs.find({books_id: req.params.id, user_id: req.session.user_id}, {content: 0})
    console.log(blogsData)
    res.send(this.succ('', blogsData))
  }
  async addBook (req, res, next) {
    
  }
  async getBookRename (req, res, next) {
    
  }
  async deleteBook (req, res, next) {
    
  }
}

export default new Book()
