'use strict'

import Base from './common/base'
import books from '../models/books'
import blog from './blog'
import blogs from '../models/blogs'
import booksData from '../models/mock/books-data'

class Book extends Base {
  constructor(){
    super()
    this.getBooks = this.getBooks.bind(this)
    this.initData = this.initData.bind(this)
    this.getBookBlogs = this.getBookBlogs.bind(this)
    this.getBookBlogsOld = this.getBookBlogsOld.bind(this)
    this.addBook = this.addBook.bind(this)
    this.bookRename = this.bookRename.bind(this)
    this.deleteBook = this.deleteBook.bind(this)
  }
  /**
   * 用户获得自己的books信息.
   */
  async getBooks (req, res, next) {
    this.checkUserAuth(req)
    let query = {}
    query.creater = req.session.user_id
    query.status = 1
    if (req.query.only_book) {
      query.book_type = 'BOOK'
    }
    let booksData = await books.find(query)
    // 该用户没有books,进行初始化.
    if (!booksData || booksData.length == 0) {
      booksData = await this.initData(req.session.user_id)
      console.log('booksData: ' + JSON.stringify(booksData))
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
      book_name: '垃圾桶',
      book_type: 'TRASH',
      book_order: 9999999,
      creater: user_id,
      updater: user_id
    })
    return books.create(booksData)
  }
  async getBookBlogs (req, res, next) {
    this.checkUserAuth(req)
    // let bookData = await books.findOne({_id: req.params.id, status: 1, creater: req.session.user_id})
    // let query = { creater: req.session.user_id, status: 1 }
    // // 判断是否是trash类型
    // if (bookData.book_type == 'TRASH') {
    //   // trash 类型查询已删除的博客
    //   query.blog_status = 'DELETE'
    // } else {
    //   // 查询当前文集,当前用户下博客,不查询content字段(太长)  
    //   query.book = req.params.id,
    //   query.blog_status = {'$ne': 'DELETE'}
    // }
    // let blogsData = await blogs.find(query, {content: 0})
    let blogsData = await blog.getBookBlogs(req.params.id)
    res.send(this.succ('', blogsData))
  }
  async getBookBlogsOld (req, res, next) {
    this.checkUserAuth(req)
    let bookData = await books.findOne({_id: req.params.id, status: 1, creater: req.session.user_id})
    let query = { creater: req.session.user_id, status: 1 }
    // 判断是否是trash类型
    if (bookData.book_type == 'TRASH') {
      // trash 类型查询已删除的博客
      query.blog_status = 'DELETE'
    } else {
      // 查询当前文集,当前用户下博客,不查询content字段(太长)  
      query.book = req.params.id,
      query.blog_status = {'$ne': 'DELETE'}
    }
    let blogsData = await blogs.find(query, {content: 0})
    res.send(this.succ('', blogsData))
  }
  /**
   * 添加book。
   */
  async addBook (req, res, next) {
    this.checkUserAuth(req)
    // 获得min order -1
    let maxBook = await books.findOne({status: 1}).sort({'book_order': -1}).skip(1).limit(1)
    let order = maxBook.book_order + 1
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
  // 文集名称修改
  async bookRename (req, res, next) {
    this.checkUserAuth(req)
    // TODO 入参需要非空校验。
    let query = {
      _id: req.body.book_id,
      creater: req.session.user_id
    }
    await books.updateOne(query, {book_name: req.body.book_name})
    res.send(this.succ('修改完成'))
  }
  // 删除文集
  async deleteBook (req, res, next) {
    this.checkUserAuth(req)
    // 文集中没有文章才可以删除
    let blogList = await blogs.find({book: req.params.id, status: 1})
    if (!blogList || blogList.length == 0) {
      await books.updateOne({_id: req.params.id, creater: req.session.user_id}, {status: 0})
      res.send(this.succ('删除完成'))
    } else {
      throw new Error('文集中存在博客无法删除')
    }
  }
}

export default new Book()
