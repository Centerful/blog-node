'use strict'

import blogsData from '../models/mock/blogs-data'
import blogsDetailData from '../models/mock/blogs-detail-data'

class Blog {
  constructor(){}
  async getBlogs (req, resp, next) {
    // get请求中?后边的参数
    // post请求中body中的参数
    // json请求中的json对象.
    let data = blogsData;
    if (req.query.id) {
      data = data.find((e) => {
        if (e.blogID === parseInt(req.query.id)) {
          return e
        }
      })
      data = [data]
    }
    resp.send(data);
  }
  async getBlogById (req, resp, next) {
    if (req.params.id) {
      let data = blogsDetailData.find((e) => {
        if (e.blogID === parseInt(req.params.id)) {
          return e
        }
      })
      resp.send(data ? data : '');
    } else {
      // TODO 抛出异常
    }
  }
  async addBlog (req, resp, next) {
    
  }
  async updateBlog (req, resp, next) {
    
  }
  async deleteToTrash (req, resp, next) {
    
  }
  async getBlogExtends (req, resp, next) {
    
  }
  async getBlogComments (req, resp, next) {
    
  }
  async addBlogComment (req, resp, next) {
    
  }
  async deleteBlogComment (req, resp, next) {
    
  }
  async pulish (req, resp, next) {
    
  }
  async move (req, resp, next) {
    
  }
  async reorder (req, resp, next) {
    
  }
  async addThumb (req, resp, next) {
    
  }
  async deleteThumb (req, resp, next) {
    
  }
  async getBlogHistorys (req, resp, next) {
    
  }
  async getBlogHistory (req, resp, next) {
    
  }
  async reversion (req, resp, next) {
    
  }
  async getTrashs (req, resp, next) {
    
  }
  async getTrashById (req, resp, next) {
    
  }
  async updateTrash (req, resp, next) {
    
  }
  async restore (req, resp, next) {
    
  }
  async deleteTrash (req, resp, next) {
    
  }
}

export default new Blog()
