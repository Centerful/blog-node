'use strict'

import base from './common/base'
import blogs from '../models/blogs'
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
    let data = blogsData;
    if (req.query.id) {
      data = data.find((e) => {
        if (e.blogID === parseInt(req.query.id)) {
          return e
        }
      })
      data = [data]
    }
    res.send(data);
  }
  async getBlogById (req, res, next) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error("用户登录后才能进行此操作")
    }
    if (!req.params.id) {
      throw new Error("参数错误")
    }
    let blog = await blogs.findOne({id: req.params.id})
    if (!blog) {
      throw new Error("该博客不存在")
    }
    res.send(blog);
  }
  async addBlog (req, res, next) {
    let data = {
      id: null,
      user_id: req.session.user_id,
      title: req.body.title,
      books_id: req.body.books_id,
      blog_order: req.body.blog_order
    }
    // TODO data中的字段都是必填的.
    data.create_id = data.user_id
    data.update_id = data.user_id
    data.id = await this.getId('blogs')
    let blog = await blogs.create(data)
    res.send(this.succ('新增博客', blog))
  }
  async updateBlog (req, res, next) {
    let data = {
      blog_img: req.body.blog_img,
      title: req.body.title,
      content: req.body.content,
      update_id: req.session.user_id,
      update_time: Date.now()
    }
    // TODO data对象校验
    await blogs.updateOne({id: req.body.id}, data)
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
