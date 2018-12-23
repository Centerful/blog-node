'use strict'

import feedsData from '../models/mock/feed-data'
import feedsCommentsData from '../models/mock/feed-comments-data.js'

import Base from './common/base'
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
    let result = await feeds.find(query, 'feed_date feed_status content images videos topic comments_count thumbs_count thumbs creater update_time ').populate({path: 'creater', model: users, select: 'nick_name user_avatar _id' })
    res.send(this.succ('', result))
  }
  async addFeeds (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      images: req.body.feedImg,
      content: req.body.feedContent,
      videos: req.body.feedVideo,
      topic: req.body.topic,
      creater: req.session.user_id,
      updater: req.session.user_id,
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
  async getFeedComments (req, res, next) {
    if (req.params.id) {
      let data = feedsCommentsData.find((e) => {
        if (e.feedId === parseInt(req.params.id)) {
          return e
        }
      })
      res.send(data ? data.comments : '');
    } else {
      // TODO 抛出异常
    }
  }
  async addFeedComment (req, res, next) {
    
  }
  async deleteFeedComment (req, res, next) {
    
  }
  async addThumb (req, res, next) {
    
  }
  async deleteThumb (req, res, next) {
    
  }
}

export default new Feed()
