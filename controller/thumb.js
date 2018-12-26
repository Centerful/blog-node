'use strict'

import base from './common/base'
import thumbs from '../models/thumbs'
import constant from './common/constant';
import feeds from '../models/feeds'
import blogs from '../models/blogs'
import comments from '../models/comments'
import users from '../models/users'

class Thumb extends base {
  constructor(){
    super()
    this.getThumbs = this.getThumbs.bind(this)
    this._isThumbs = this._isThumbs.bind(this)
    this.addThumbs = this.addThumbs.bind(this)
    this.deleteThumbs = this.deleteThumbs.bind(this)
    this.getThumbUsers = this.getThumbUsers.bind(this)
  }
  async getThumbs (req, res, next) {
    
  }
  async addThumbs (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      relation: req.body.relation,
      relation_type: req.body.relation_type,
      user: req.session.user_id
    }
    let t = await thumbs.findOne(data)
    if (t) {
      await thumbs.updateOne({_id: t._id}, {status: 1, thumb_status: constant.thumb_status.normal, update_time: Date.now()})
    } else {
      await thumbs.create(data)
    }
    if (data.relation_type.toUpperCase() == constant.thumb_rela_type.feed) {
      await feeds.updateOne({_id: data.relation}, {"$inc": {thumbs_count: 1}})
    } else if (data.relation_type.toUpperCase() == constant.thumb_rela_type.comment) {
      await comments.updateOne({_id: data.relation}, {"$inc": {thumbs_count: 1}})
    } else if (data.relation_type.toUpperCase() == constant.thumb_rela_type.blog) {
      await blogs.updateOne({_id: data.relation}, {"$inc": {thumbs_count: 1}})
    }
    res.send(this.succ('点赞成功'))
  }
  async deleteThumbs (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      relation: req.query.relation,
      relation_type: req.query.relation_type,
      user: req.session.user_id
    }
    await thumbs.updateOne({relation: data.relation, user: data.user}, {status: 0, thumb_status: constant.thumb_status.deleted})
    if (data.relation_type.toUpperCase() == constant.thumb_rela_type.feed) {
      await feeds.updateOne({_id: data.relation}, {"$inc": {thumbs_count: -1}})
    } else if (data.relation_type.toUpperCase() == constant.thumb_rela_type.comment) {
      await comments.updateOne({_id: data.relation}, {"$inc": {thumbs_count: -1}})
    } else if (data.relation_type.toUpperCase() == constant.thumb_rela_type.blog) {
      await blogs.updateOne({_id: data.relation}, {"$inc": {'publish.thumbs_count': -1}})
    }
    res.send(this.succ('删除点赞'))
  }
  // 查询用户点赞信息,返回用户点赞过的记录
  async _isThumbs (query = {
    relation: Array,
    user: String
  }) {
    if (!query.relation || !query.user) 
      this.throwEx('参数不能为空')
    let list = await thumbs.find({relation: {$in: query.relation}, user: query.user, status: 1}, 'relation').lean()
    
    return list.map((i)=>{
      return i.relation.toString()
    })
  }
  async getThumbUsers (req, res, next) {
    
  }
}

export default new Thumb()
