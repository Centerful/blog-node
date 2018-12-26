'use strict'

import feedsData from '../models/mock/feed-data'
import feedsCommentsData from '../models/mock/feed-comments-data.js'

import Base from './common/base'
import Sequence from './common/sequence'
import comment from './comment'
import thumb from './thumb'
import users from '../models/users'
import feeds from '../models/feeds'
import tagTopic from './tag_topic'
import constant from "./common/constant";

class Feed extends Base{
  constructor(){
    super()
    this.getFeeds = this.getFeeds.bind(this)
    this.addFeeds = this.addFeeds.bind(this)
    this.deleteFeeds = this.deleteFeeds.bind(this)
    this.encrypt = this.encrypt.bind(this)
    this.public = this.public.bind(this)
  }
  async getFeeds (req, res, next) {
    let {
      user_id,
      _id,
    } = req.query
    let query = {}
    if (user_id) 
      { query.user = user_id }
    if (_id)
      { query._id = {$lt: _id}}
    query.status = 1
    // 使用lean方法，mongoose返回的是json对象，不再是mongoose的文档对象，此时可以对返回对象进行修改。
    let result = await feeds.find(query, '_id feed_date feed_status content images videos topic comments_count thumbs_count thumbs user update_time ').populate({path: 'user', model: users, select: 'nick_name user_avatar _id' }).sort({'update_time': -1}).limit(10).lean()
    if (!result || result.length <= 0) {
      res.send(this.succ('', result))
      return
    }
    // 如果用户没有登陆，则不用查看点赞状态
    if (!req.session.user_id) {
      res.send(this.succ('', result))
      return
    }
    let _ids = result.map((i)=> {
      return i._id
    })
    // 查询当前用户点赞了哪些feed
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
  async addFeeds (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      images: req.body.feedImg,
      content: req.body.feedContent,
      videos: req.body.feedVideo,
      topic: req.body.topic,
      user: req.session.user_id,
      feed_status: req.body.feed_status,
      feed_date: Date.now()
    }
    data = await feeds.create(data)
    res.send(this.succ('', data))
    // 插入标签
    tagTopic.addTags(req.body.topic, constant.tag_type.topic)
  }
  async deleteFeeds (req, res, next) {
    this.checkUserAuth(req)
    // 只能删除自己的feed
    let result = await feeds.updateOne({_id: req.params.id, user: req.session.user_id}, {$set: {status: 0}})
    if (result.ok)
      res.send(this.succ('删除成功'))
    else
      res.send(this.fail('删除失败'))
  }
  async encrypt (req, res, next) {
    
  }
  async public (req, res, next) {
    this.checkUserAuth(req)
    let result = await feeds.updateOne({_id: req.params.id, user: req.session.user_id}, {$set: {feed_status: 'NORMAL'}})
    if (result.ok)
      res.send(this.succ('操作成功'))
    else
      res.send(this.fail('操作失败'))
  }
}

export default new Feed()
