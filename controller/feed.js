'use strict'

import feedsData from '../models/mock/feed-data'
import feedsCommentsData from '../models/mock/feed-comments-data.js'

class Feed {
  constructor(){}
  async getFeeds (req, resp, next) {
    resp.send(feedsData);
  }
  async addFeeds (req, resp, next) {
    
  }
  async deleteFeeds (req, resp, next) {
    
  }
  async encrypt (req, resp, next) {
    
  }
  async private (req, resp, next) {
    
  }
  async getFeedComments (req, resp, next) {
    if (req.params.id) {
      let data = feedsCommentsData.find((e) => {
        if (e.feedId === parseInt(req.params.id)) {
          return e
        }
      })
      resp.send(data ? data.comments : '');
    } else {
      // TODO 抛出异常
    }
  }
  async addFeedComment (req, resp, next) {
    
  }
  async deleteFeedComment (req, resp, next) {
    
  }
  async addThumb (req, resp, next) {
    
  }
  async deleteThumb (req, resp, next) {
    
  }
}

export default new Feed()
