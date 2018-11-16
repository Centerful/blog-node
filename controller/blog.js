'use strict'

import _ from 'lodash'
import base from './common/base'
import blogs from '../models/blogs'
import blogsHis from '../models/blogs_his'
import books from '../models/books'
import users from '../models/users'
import blogsData from '../models/mock/blogs-data'
import blogsDetailData from '../models/mock/blogs-detail-data'

class Blog extends base{
  constructor(){
    super()
    this.getBlogs = this.getBlogs.bind(this)
    this.getBlogById = this.getBlogById.bind(this)
    this.addBlog = this.addBlog.bind(this)
    this.updateBlog = this.updateBlog.bind(this)
    this.deleteToTrash = this.deleteToTrash.bind(this)
    this.getBlogExtends = this.getBlogExtends.bind(this)
    this.getBlogComments = this.getBlogComments.bind(this)
    this.addBlogComment = this.addBlogComment.bind(this)
    this.deleteBlogComment = this.deleteBlogComment.bind(this)
    this.pulish = this.pulish.bind(this)
    this.cleanBlog = this.cleanBlog.bind(this)
    this.reorder = this.reorder.bind(this)
    this.addThumb = this.addThumb.bind(this)
    this.deleteThumb = this.deleteThumb.bind(this)
    this.getBlogHistorys = this.getBlogHistorys.bind(this)
    this.getBlogHistory = this.getBlogHistory.bind(this)
    this.reversion = this.reversion.bind(this)
    this.getTrashs = this.getTrashs.bind(this)
    this.getTrashById = this.getTrashById.bind(this)
    this.updateTrash = this.updateTrash.bind(this)
    this.restore = this.restore.bind(this)
    this.deleteTrash = this.deleteTrash.bind(this)
    this._convertBlog = this._convertBlog.bind(this)
    this._converPublish = this._converPublish.bind(this)
  }
  async getBlogs (req, res, next) {
    // 每次只查询10条数据。
    // 查询参数定义.根据用户、某一天、某个tag、博客类型（HOT，NEW，REPUBLISH等）
    // TODO 查询的后期优化：根据用户关注的tag，以及关注作者生成推送流。这应该有个算法。
    let { // 对象解构
      title,
      user_id,
      tag_id,
      update_time,
      blog_type,
      last_update_time // 最后一个博客的更新时间
    } = req.query
    let query = {}
    if (title) 
      { query["publish.title"] = title }
    if (user_id) 
      { query["user"] = user_id }
    if (tag_id) 
      { query["publish.tags"] = tag_id }
    if (update_time) 
      { query["publish.update_time"] = update_time }
    if (blog_type) 
      { query["publish.blog_type"] = blog_type }
    if (last_update_time) // 这里需要调整。
      { query["publish.last_update_time"] = last_update_time }
    // TODO 需要改成已发布。
    query.blog_status = 'PUBLISH'
    query.status = 1
    let data = await blogs.find(query).populate({path: 'user', model: users, select: 'nick_name user_avatar' }).sort({'publish.publish_time': -1}).limit(10)
    console.log(data)
    res.send(this.succ('', data.map((e, index, arr) => {
      // 使用lodash中pick进行field过滤
      let ele = _.pick(e, ['_id', 'publish.blog_type', 'publish.title', 'publish.blog_img', 'user', 'update_time', 'publish.content', 'publish.tags'])
      // 对field的值进行操作
      // 对content内容进行截断
      if (ele.content) {
        ele.content = ele.content.substring(0, 200)
      }
      // 返回对象
      return ele
    })))
  }
  async getBlogById (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error('用户登录后才能进行此操作')
    }
    if (!req.params.id) {
      throw new Error('参数错误')
    }
    let blog = await blogs.findOne({_id: req.params.id}).populate({path: 'user', model: users, select: 'nick_name user_avatar signature _id' })
    if (!blog) {
      throw new Error('该博客不存在')
    }
    res.send(this.succ('', this._convertBlog(blog)));
  }
  async addBlog (req, res, next) {
    // 新增write数据。
    let blog_write = {
      user: req.session.user_id,
      'write.title': req.body.title,
      'write.book': req.body.books_id,
      'write.blog_order': req.body.blog_order
    }
    blog_write = await blogs.create(blog_write)

    // 将blog数据插入his中。
    let blog_his = {
      blog: blog_write._id,
      title: req.body.title,
      operation_status: 'ADD'
    }
    await blogsHis.create(blog_his)
    // 将blog的write对象中的字段与blog的普通字段融合。merge中便后对象的同名字段会覆盖前面的。
    res.send(this.succ('新增博客', this._convertBlog(blog_write)))
  }
  async updateBlog (req, res, next) {
    let data = {
      "write.blog_img": req.body.blog_img,
      "write.title": req.body.title,
      "write.content": req.body.content,
      "write.write_user": req.session.user_id,
      "write.write_time": Date.now()
    }

    // 只能更新属于自己的博客
    await blogs.updateOne({_id: req.body._id, user: req.session.user_id}, {$set: data})

    // 插入历史记录
    let his = {
      blog: req.body._id,
      blog_img: req.body.blog_img,
      title: req.body.title,
      content: req.body.content,
      operation_status: 'UPDATE'
    }
    await blogsHis.create(his)
    res.send(this.succ('更新博客'))
  }
  /**
   * 将博客移动到垃圾箱中
   */
  async deleteToTrash (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error('用户登录后才能进行此操作')
    }
    if (!req.params.id) {
      throw new Error('参数错误')
    }
    // 判断该文集是否 publish TODO
    let blog = await blogs.findOne({_id: req.params.id, user: req.session.user_id})
    if (!blog) {
      throw new Error('该博客不存在！')
    }
    if (blog.blog_status == 'PUBLISH') {
      throw new Error('取消博客发布后才能删除！')
    }
    // 查询垃圾桶中最大order
    let query = {
      user: req.session.user_id, 
      blog_status: 'DELETE',
      status: 1
    }
    // 查询最大序号
    let maxBlogs = await blogs.findOne(query).sort({"write.blog_order": -1}).skip(1).limit(1)
    let maxOrder = 1
    if (maxBlogs) {
      maxOrder = maxBlogs.write.blog_order + 1
    }
    // 查询垃圾桶的id
    let trash = await books.findOne({book_type: 'TRASH', creater: req.session.user_id, status: 1})
    // 将博客状态修改为DELETE,blog_order修改为DELETE中最大的，原books的id不要修改。到时候可以恢复回去(界面下拉框中默认选项)
    await blogs.updateOne({_id: req.params.id, user: req.session.user_id}, {"$set": {blog_status: 'DELETE', "write.blog_order": maxOrder, "write.book": trash._id}})
    res.send(this.succ('博客已移动到垃圾桶'))
  }
  async getBlogExtends (req, res, next) {
    
  }
  async getBlogComments (req, res, next) {
    
  }
  async addBlogComment (req, res, next) {
    
  }
  async deleteBlogComment (req, res, next) {
    
  }
  async pulish (req, res, next) {
    
  }
  /**
   * 将博客从垃圾桶中删除。status = 0
   */
  async cleanBlog (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error('用户登录后才能进行此操作')
    }
    if (!req.params.id) {
      throw new Error('参数错误')
    }
    await blogs.updateOne({_id: req.params.id, user: req.session.user_id}, {status: '0'})
    res.send(this.succ('删除成功'))
  }
  async reorder (req, res, next) {
    
  }
  async addThumb (req, res, next) {
    
  }
  async deleteThumb (req, res, next) {
    
  }
  async getBlogHistorys (req, res, next) {
    
  }
  async getBlogHistory (req, res, next) {
    
  }
  // 将博客恢复
  async reversion (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error('用户登录后才能进行此操作')
    }
    let query = {_id: req.body.book_id, status: 1, creater: req.session.user_id}
    let bookData = await books.findOne(query)
    if (bookData == 'TRASH') {
      throw new Error('不能恢复至垃圾桶中')
    }
    // 查询最大序号
    let maxBlogs = await blogs.findOne({book: query._id, status: 1, user: req.session.user_id}).sort({blog_order: -1}).skip(1).limit(1)
    let maxOrder = 1
    if (maxBlogs) {
      maxOrder = maxBlogs.blog_order + 1
    }
    await blogs.updateOne({_id: req.body.blog_id, user: req.session.user_id}, {"$set": {blog_status: 'DRAFT', "write.blog_order": maxOrder, "write.book": req.body.book_id}})
    res.send(this.succ('恢复完成', {blog_order: maxOrder}))
  }
  async getTrashs (req, res, next) {
    
  }
  async getTrashById (req, res, next) {
    
  }
  async updateTrash (req, res, next) {
    
  }
  async restore (req, res, next) {
    
  }
  async deleteTrash (req, res, next) {
    
  }
  async getBookBlogs (book_id) {
    let query = {
      status: 1,
      'write.book': book_id
    }
    let blog_write = await blogs.find(query, {publish:0})
    let blog = []
    blog = blog_write.map((ele) => {
      return this._convertBlog(ele)
    })
    return blog
  }
  _convertBlog (blog_write) {
    return {
      _id: blog_write._id,
      user: blog_write.user,
      blog_status: blog_write.blog_status,
      status: blog_write.status,
      book: blog_write.write.book,
      blog_img: blog_write.write.blog_img,
      title: blog_write.write.title,
      content: blog_write.write.content,
      blog_order: blog_write.write.blog_order,
      create_time: blog_write.write.create_time,
      write_user: blog_write.write.write_user,
      write_time: blog_write.write.write_time
    }
  }
  _converPublish (blog_write) {
    return {
      _id: blog_write._id,
      user: blog_write.user,
      blog_status: blog_write.blog_status,
      status: blog_write.status
    }
  }
}

export default new Blog()
