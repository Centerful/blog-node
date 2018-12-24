'use strict'

import feedsData from '../models/mock/feed-data'
import feedsCommentsData from '../models/mock/feed-comments-data.js'

import Base from './common/base'
import Sequence from './common/sequence'
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
    this.private = this.private.bind(this)
    this.getFeedComments = this.getFeedComments.bind(this)
    this.addFeedComment = this.addFeedComment.bind(this)
    this.deleteFeedComment = this.deleteFeedComment.bind(this)
    this.addThumb = this.addThumb.bind(this)
    this.deleteThumb = this.deleteThumb.bind(this)
  }
  async getFeeds (req, res, next) {
    let {
      user_id
    } = req.query
    let query = {}
    if (user_id) 
      { query.user = user_id }
    let result = await feeds.find(query, 'feed_date feed_status content images videos topic comments_count thumbs_count thumbs user update_time ').populate({path: 'user', model: users, select: 'nick_name user_avatar _id' }).sort({'update_time': -1})
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
    
  }
  async encrypt (req, res, next) {
    
  }
  async private (req, res, next) {
    
  }
  // 查询feed的评论，
  async getFeedComments (req, res, next) {
    let comments = await feeds.findOne({_id: req.params.id}, 'comments')
      .populate({ path: 'comments.user', model: users, select: 'nick_name user_avatar _id' })
      .populate({path: 'comments.reply_user', model: users, select: 'nick_name user_avatar _id' })
    res.send(this.succ('', comments))
  }
  /**
   * 新增feed评论，feed的评论是简单评论，文行文本框，长度不能超过200字符
   * feed._id,conetnt,user(req中的用户),reply(回复的评论),reply(回复评论的用户),origin(第一条评论的_id)
   */
  async addFeedComment (req, res, next) {
    this.checkUserAuth(req)
    let _id = await new Sequence().getId()
    let comment = {
      _id: _id,
      origin: req.body.origin,
      user: req.session.user_id,
      content: req.body.content,
      reply: req.body.reply,
      reply_user: req.body.reply_user
    }
    let count = await feeds.findOne({_id: req.body.feed_id}, 'comments_count ')
    // comments_count: count.comments_count + 1
    await feeds.updateOne({_id: req.body.feed_id, user: req.session.user_id}, {"$push": { comments: comment }, "$inc": {comments_count: 1}})
    let reply = await feeds.findOne({_id: req.body.feed_id, "comments._id": _id}, 'comments')
      .populate({ path: 'comments.user', model: users, select: 'nick_name user_avatar _id' })
      .populate({path: 'comments.reply_user', model: users, select: 'nick_name user_avatar _id' })
    res.send(this.succ('添加评论成功', reply))
  }
  async deleteFeedComment (req, res, next) {
    
  }
  async addThumb (req, res, next) {
    
  }
  async deleteThumb (req, res, next) {
    
  }
}

export default new Feed()
