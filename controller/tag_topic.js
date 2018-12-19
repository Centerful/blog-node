import constant from "./common/constant";
import tagTopic from "../models/tag_topics";
import { WSA_E_CANCELLED } from "constants";

'use strict'

class TagTopic {
  constructor(){}
  async getTags (req, resp, next) {
    
  }
  async getTagById (req, resp, next) {
    
  }
  async addTag (req, resp, next) {
    
  }
  async deleteTag (req, resp, next) {
    
  }
  async addTags (tags, type) {
    if (!tags || tags.length === 0) {
      return
    }
    // 1.查询
    let ts = await tagTopic.find({'name': {'$in': tags}})
    
    // 2.过滤重复
    if (!ts || ts.length === 0) {
      tags = tags.filter((ele) => {
        return ts.indexOf(ele) < 0
      })
    }

    // 3.插入
    let arr = tags.map((ele) => {
      return {
        name: ele,
        type: type || constant.tag_type.tag
      }
    })
    // 不必等待。
    tagTopic.insertMany(arr)
  }
  async _getTags () {
    let tags = await tagTopic.find({type: constant.tag_type.tag, status: 1})
    return tags.map((e) => {
      return e.name
    })
  }
}

export default new TagTopic()
