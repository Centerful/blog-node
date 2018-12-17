'use strict'

import columns from '../models/columns'
import Base from './common/base'
import tagTopic from './tag_topic'
import users from '../models/users'

import columnsData from '../models/mock/columns-data'
import columnsDetailData from '../models/mock/columns-detail-data.js'
import columnsBlogsData from '../models/mock/columns-blogs-data.js'


class Column extends Base{
  constructor(){
    super()
    this.getColumns = this.getColumns.bind(this)
    this.getColumnById = this.getColumnById.bind(this)
    this.getColumnBlogs = this.getColumnBlogs.bind(this)
    this.addColumn = this.addColumn.bind(this)
    this.updateColumn = this.updateColumn.bind(this)
    this.patchColumn = this.patchColumn.bind(this)
    this.deleteColumn = this.deleteColumn.bind(this)
    this.blogRemove = this.blogRemove.bind(this)
  }

  /**
   * 查询专栏列表
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async getColumns (req, res, next) {
    let {
      user_id
    } = req.query
    let query = {}
    if (user_id) 
      { query.user = user_id }
    let result = await columns.find(query).populate({path: 'creater', model: users, select: 'nick_name user_avatar _id' })
    res.send(this.succ('', result))
  }

  /**
   * 下拉框查询
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async getColumnsBySelect (req, res, next) {
    let {
      user_id
    } = req.query
    let query = {}
    if (user_id) 
      { query.user = user_id }
    let result = await columns.find(query).populate({path: 'creater', model: users, select: 'nick_name user_avatar _id' }).limit(6)
    res.send(this.succ('', result))
  }

  /**
   * 查询专栏详细
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async getColumnById (req, res, next) {
    this.checkUserAuth(req)
    let data = await columns.findOne({_id: req.params.id}).populate({path: 'creater', model: users, select: 'nick_name user_avatar signature _id' })
    if (!data) {
      throw new Error('该专栏不存在')
    }
    res.send(this.succ('', data));
  }
  async getColumnBlogs (req, res, next) {
    if (req.params.id) {
      let data = columnsBlogsData.find((e) => {
        if (e._id === parseInt(req.params.id)) {
          return e
        }
      })
      res.send(data ? data.blogs : '');
    } else {
      // TODO 抛出异常
    }
  }
  async _getColumns (user_id) {
    let data = await columns.find({user: user_id, status: 1})
    return data.map((e) => {
      return {
        _id: data._id,
        column_name: data.column_name
      }
    })
  }

  /**
   * 新增专栏
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async addColumn (req, res, next) {
    this.checkUserAuth(req)
    let data = {
      column_name: req.body.columns_name,
      column_img: req.body.column_img,
      introduction: req.body.introduction,
      columns_domain: req.body.columns_domain,
      tags: req.body.tags,
      creater: req.session.user_id,
      updater: req.session.user_id
    }
    data = await columns.create(data)
    res.send(this.succ('', data))

    // 插入标签
    tagTopic.addTags(req.body.tags)
  }
  async updateColumn (req, res, next) {
    res.render('index', { title: 'updateColumn 页面' })
  }
  async patchColumn (req, res, next) {
    res.render('index', { title: 'patchColumn 页面' })
  }
  async deleteColumn (req, res, next) {
    res.render('index', { title: 'deleteColumn 页面' })
  }
  async blogRemove (req, res, next) {
    res.render('index', { title: 'blogRemove 页面' })
  }
}

export default new Column()
