'use strict'

import _ from 'lodash'
import base from './common/base'
import blogs from '../models/blogs'
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
    this.move = this.move.bind(this)
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
      { query.title = title }
    if (user_id) 
      { query.user = user_id }
    if (tag_id) 
      { query.tag = tag_id }
    if (update_time) 
      { query.update_time = update_time }
    if (blog_type) 
      { query.blog_type = blog_type }
    if (last_update_time) // 这里需要调整。
      { query.last_update_time = last_update_time }
    // TODO 需要改成已发布。
    query.blog_status = 'DRAFT'
    let data = await blogs.find(query).populate({path: 'user', model: users, select: 'nick_name user_avatar' }).sort({'update_time': -1}).limit(10)
    console.log(data)
    res.send(this.succ('', data.map((e, index, arr) => {
      // 使用lodash中pick进行field过滤
      let ele = _.pick(e, ['_id', 'blog_type', 'title', 'blog_img', 'user', 'update_time', 'content', 'tags'])
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
      throw new Error("用户登录后才能进行此操作")
    }
    if (!req.params.id) {
      throw new Error("参数错误")
    }
    let blog = await blogs.findOne({_id: req.params.id}).populate({path: 'user', model: users, select: 'nick_name user_avatar signature _id' })
    if (!blog) {
      throw new Error("该博客不存在")
    }
    res.send(blog);
  }
  async addBlog (req, res, next) {
    let data = {
      user: req.session.user_id,
      title: req.body.title,
      book: req.body.books_id,
      blog_order: req.body.blog_order
    }
    // TODO data中的字段都是必填的.
    data.creater = data.user
    data.updater = data.user
    let blog = await blogs.create(data)
    res.send(this.succ('新增博客', blog))
  }
  async updateBlog (req, res, next) {
    let data = {
      blog_img: req.body.blog_img,
      title: req.body.title,
      content: req.body.content,
      updater: req.session.user_id,
      update_time: Date.now()
    }
    // TODO data对象校验
    await blogs.updateOne({_id: req.body._id}, data)
    res.send(this.succ('更新博客'))
  }
  async deleteToTrash (req, res, next) {
    
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
  async move (req, res, next) {
    
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
  async reversion (req, res, next) {
    
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
}

export default new Blog()
