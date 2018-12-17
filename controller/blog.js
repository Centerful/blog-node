'use strict'

import _ from 'lodash'
import blogs from '../models/blogs'
import blogsHis from '../models/blogs_his'
import books from '../models/books'
import users from '../models/users'
import base from './common/base'
import constant from './common/constant'
import tagTopic from './tag_topic'
import column from './column'
import columns from '../models/columns'

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
    this.publish = this.publish.bind(this)
    this.getPublishs = this.getPublishs.bind(this)
    this.getPublishSummaryById = this.getPublishSummaryById.bind(this)
    this.getPublishById = this.getPublishById.bind(this)
    this.cancelPublish = this.cancelPublish.bind(this)
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
  async getPublishs (req, res, next) {
    // 每次只查询10条数据。
    // 查询参数定义.根据用户、某一天、某个tag、博客类型（HOT，NEW，REPUBLISH等）
    // TODO 查询的后期优化：根据用户关注的tag，以及关注作者生成推送流。这应该有个算法。
    let { // 对象解构
      title,
      user_id,
      tag_name,
      column_id,
      update_time,
      blog_type,
      last_update_time // 最后一个博客的更新时间
    } = req.query
    let query = {}
    if (title) 
      { query["publish.title"] = title }
    if (user_id) 
      { query["user"] = user_id }
    if (tag_name) 
      { query["publish.tags"] = tag_name }
    if (update_time) 
      { query["publish.update_time"] = update_time }
    if (blog_type) 
      { query["publish.blog_type"] = blog_type }
    if (column_id)
      { query["publish.column"] = column_id }
    if (last_update_time) // 这里需要调整。
      { query["publish.last_update_time"] = last_update_time }
    query.blog_status = constant.blog_status.publish
    query.status = 1
    let data = await blogs.find(query).populate({path: 'user', model: users, select: 'nick_name user_avatar' }).sort({'publish.publish_time': -1}).limit(10)
    let result = data.map((ele) => {
      let conver = this._converPublish(ele)
      if (ele.content) {
        conver.content = conver.content.substring(0, 200)
      }
      return conver
    })
    res.send(this.succ('', result))
  }
  async getBlogs (req, res, next) {
    
  }
  /**
   * 查询博客详细信息
   */
  async getBlogById (req, res, next) {
    this.checkUserAuth(req)
    let blog = await blogs.findOne({_id: req.params.id}).populate({path: 'user', model: users, select: 'nick_name user_avatar signature _id' })
    if (!blog) {
      throw new Error('该博客不存在')
    }
    res.send(this.succ('', this._convertBlog(blog)))
  }
  /**
   * 新增博客信息
   */
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
  /**
   * 更新博客信息
   */
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
    this.checkUserAuth(req)
    // 判断该文集是否 publish
    let blog = await blogs.findOne({_id: req.params.id, user: req.session.user_id})
    if (!blog) {
      throw new Error('该博客不存在！')
    }
    if (blog.blog_status == constant.blog_status.publish) {
      throw new Error('取消博客发布后才能删除！')
    }
    // 查询垃圾桶中最大order
    let query = {
      user: req.session.user_id, 
      blog_status: constant.blog_status.deleted,
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
  /**
   * 博客发布与更新发布
   * 检测blog状态是否为草稿。
   * user_id是否对的上。
   * 插入blog_his数据
   * 更新tags数据。
   * 将blog状态修改为已发布并更新发布信息。
   */
  async publish (req, res, next) {
    this.checkUserAuth(req)
    let blog = await blogs.findOne({_id: req.params.id, user: req.session.user_id, status: 1})

    if(!blog || (blog.blog_status != constant.blog_status.draft && blog.blog_status != constant.blog_status.publish)) {
      throw new Error('该博客不能发布')
    }

    // 插入历史数据
    let his = {
      blog: blog._id,
      blog_img: blog.write.blog_img,
      title: blog.write.title,
      content: blog.write.content,
      operation_status: blog.blog_status === constant.blog_status.publish ? constant.blog_his_oper.updatePub : constant.blog_his_oper.publish
    }
    await blogsHis.create(his)

    // 插入标签
    tagTopic.addTags(req.body.tags)

    let publish = {
      blog_status: constant.blog_status.publish,
      'publish.blog_img': blog.write.blog_img, // 题图地址
      'publish.title': blog.write.title,
      'publish.content': blog.write.content,
      'publish.tags': req.body.tags,
      'publish.blog_private': req.body.blog_private,
    }
    // 发布专栏
    if (req.body.column) {
      publish['publish.column'] = req.body.column
    }
    // 状态为草稿的博客，需要发布。
    if(blog.blog_status === constant.blog_status.draft) {
      publish['publish.publish_user'] = req.session.user_id // 发布人
      publish['publish.publish_time'] = Date.now() // 第一次发布时间
    }
    // 状态为发布的博客，需要更新发布
    if(blog.blog_status === constant.blog_status.publish) {
      publish['publish.republish_time'] = Date.now() // 更新发布时间
      delete publish['publish.column'] // 更新版本不能修改发布专栏
    }
    await blogs.updateOne({_id: req.params.id, user: req.session.user_id}, {"$set": publish})
    res.send(this.succ('发布成功'))
  }
  /**
   * 博客发布时，查询博客之前是否发布过，获取发布信息。
   * 顺便返回专栏与标签信息。
   */
  async getPublishSummaryById (req, res, next) {
    this.checkUserAuth(req)
    let blog = await blogs.findOne({_id: req.params.id, user: req.session.user_id, status: 1}).populate({path: 'publish.column', model: columns, select: 'column_name _id' })
    
    // 标签信息
    let totalTags = await tagTopic._getTags()

    res.send(this.succ('', {
      column_id: blog.publish.column ? blog.publish.column.column_id : null,
      column_name: blog.publish.column ? blog.publish.column.column_name : null,
      blog_private: blog.publish.blog_private,
      tags: blog.publish.tags,
      publish_user: blog.publish.publish_user,
      publish_time: blog.publish.publish_time,
      total_tags: totalTags
    }))
  }
  async getPublishById (req, res, next) {
    this.checkUserAuth(req)
    let blog = await blogs.findOne({_id: req.params.id, status: 1}).populate({path: 'user', model: users, select: 'nick_name user_avatar signature _id' })
    if (!blog) {
      throw new Error('该博客不存在')
    }
    res.send(this.succ('', this._converPublish(blog)));
  }
  /**
   * 取消发布，将博客状态修改为草稿。
   */
  async cancelPublish (req, res, next) {
    this.checkUserAuth(req)
    let blog = await blogs.findOne({_id: req.params.id, user: req.session.user_id, status: 1})
    if (!blog || blog.blog_status != constant.blog_status.publish) {
      throw new Error('该博客不能取消发布')
    }
    // 插入历史数据
    let his = {
      blog: blog._id,
      blog_img: blog.write.blog_img,
      title: blog.write.title,
      content: blog.write.content,
      operation_status: constant.blog_his_oper.cancelPub
    }
    await blogsHis.create(his)

    await blogs.updateOne({_id: req.params.id, user: req.session.user_id}, {blog_status: constant.blog_status.draft})
    res.send(this.succ('取消发布成功'))
  }
  

  /**
   * 将博客从垃圾桶中删除。status = 0
   */
  async cleanBlog (req, res, next) {
    this.checkUserAuth(req)
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
  _convertBlog (blog) {
    return {
      _id: blog._id,
      user: blog.user,
      blog_status: blog.blog_status,
      status: blog.status,
      book: blog.write.book,
      blog_img: blog.write.blog_img,
      title: blog.write.title,
      content: blog.write.content,
      blog_order: blog.write.blog_order,
      create_time: blog.write.create_time,
      write_user: blog.write.write_user,
      write_time: blog.write.write_time
    }
  }
  _converPublish (blog) {
    return {
      _id: blog._id,
      user: blog.user,
      blog_status: blog.blog_status,
      status: blog.status,
      blog_img: blog.publish.blog_img,
      title: blog.publish.title,
      content: blog.publish.content,
      blog_type: blog.publish.blog_type,
      column: blog.publish.column,
      blog_private: blog.publish.blog_private,
      reads: blog.publish.reads,
      comments_count: blog.publish.comments_count,
      thumbs_count: blog.publish.thumbs_count,
      tags: blog.publish.tags,
      publish_user: blog.publish.publish_user,
      publish_time: blog.publish.publish_time,
      republish_time: blog.publish.republish_time
    }
  }
}

export default new Blog()
