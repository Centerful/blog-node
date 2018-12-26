'use strict'

import base from './common/base'
import comments from '../models/comments'
import users from '../models/users'
import thumb from './thumb'
import constant from './common/constant'
import feeds from '../models/feeds'
import blogs from '../models/blogs'

class Comment extends base {
  constructor(){
    super()
    this.getComments = this.getComments.bind(this)
    this.getComment = this.getComment.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.addComment = this.addComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this._checkDeleteComment = this._checkDeleteComment.bind(this)
  }

  // 查询评论
  async getComments (req, res, next) {
    if (!req.query.relation) {
      this.throwEx('关联ID不能为空')
    }
    let query = { 
      status: 1,
      relation: req.query.relation
    }
    if (req.query.start_id)
      query._id = {$lt: req.query.start_id}
    let result = await comments.find(query)
      .sort({ '_id': -1 })
      .limit(10)
      .populate({ path: 'user', model: users, select: 'nick_name user_avatar _id' })
      .populate({ path: 'reply_user', model: users, select: 'nick_name user_avatar _id' }).lean()
    // 如果用户没有登陆，则不用查看点赞状态
    if (!req.session.user_id) {
      res.send(this.succ('', result))
      return
    }
    let _ids = result.map((i)=> {
      return i._id
    })
    // 查询当前用户点赞了哪些comment
    let list = await thumb._isThumbs({
      relation: _ids,
      user: req.session.user_id
    })
    result.filter((i) => {
      if (list.indexOf(i._id.toString()) == -1)
        i.isThumb = false
      else
        i.isThumb = true
      return i
    })
    res.send(this.succ('', result))
  }
  // 查询一条评论
  async getComment (comment_id) {
    let data = await comments.findOne({_id: comment_id})
      .populate({ path: 'user', model: users, select: 'nick_name user_avatar _id' })
      .populate({ path: 'reply_user', model: users, select: 'nick_name user_avatar _id' })
    return data
  }
  async updateComment (req, res, next) {
    
  }
  /**
   * 新增feed评论，feed的评论是简单评论，文行文本框，长度不能超过200字符
   * feed._id,conetnt,user(req中的用户),reply(回复的评论),reply(回复评论的用户),origin(第一条评论的_id)
   */
  async addComment (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      relation: req.body.relation,
      relation_type: req.body.relation_type,
      origin: req.body.origin,
      user: req.session.user_id,
      content: req.body.content,
      reply: req.body.reply,
      reply_user: req.body.reply_user
    }
    data = await comments.create(data)
    data = await comments.findOne({_id: data._id})
      .populate({ path: 'user', model: users, select: 'nick_name user_avatar _id' })
      .populate({ path: 'reply_user', model: users, select: 'nick_name user_avatar _id' })
    // 更新comment_count数
    if (data.relation_type.toUpperCase() == constant.comment_rela_type.feed) {
      await feeds.updateOne({_id: data.relation}, {"$inc": {comments_count: 1}})
    }  else if (data.relation_type.toUpperCase() == constant.comment_rela_type.blog) {
      await blogs.updateOne({_id: data.relation}, {"$inc": {'publish.comments_count': 1}})
    }
    res.send(this.succ('添加评论成功', data))
  }
  // 删除评论
  async deleteComment (req, res, next) {
    this.checkUserAuth(req)
    let data = await comments.findOne({_id: req.params.id})
    if (!this._checkDeleteComment()){
      this.throwEx('用户无法删除该评论')
    }
    await comments.updateOne({_id: req.params.id}, {status: 0, comment_status: constant.comment_status.deleted})
    if (data.relation_type.toUpperCase() == constant.comment_rela_type.feed) {
      await feeds.updateOne({_id: data.relation}, {"$inc": {comments_count: -1}})
    }  else if (data.relation_type.toUpperCase() == constant.comment_rela_type.blog) {
      await blogs.updateOne({_id: data.relation}, {"$inc": {'publish.comments_count': -1}})
    }
    res.send(this.succ('删除评论成功'))
  }

  /**
   * 检查当前用户能否删除comment
   * comment的发布者，comment-relation的user。
   */ 
  _checkDeleteComment () {
    return true
    // TODO
    // 
    // let relationUser = null
    // if (data.relation_type.toUpperCase() == constant.comment_rela_type.feed) {
    //   relationUser = feeds.findOne({_id: data.relation}, 'user')
    // }  else if (data.relation_type.toUpperCase() == constant.comment_rela_type.blog) {
    //   relationUser = blogs.updateOne({_id: data.relation}, 'user')
    // }
  }

}

export default new Comment()
