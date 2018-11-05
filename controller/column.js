'use strict'

import columnsData from '../models/mock/columns-data'
import columnsDetailData from '../models/mock/columns-detail-data.js'
import columnsBlogsData from '../models/mock/columns-blogs-data.js'

class Column {
  constructor(){}
  async getColumns (req, res, next) {
    res.send(columnsData)
  }
  async getColumnById (req, res, next) {
    if (req.params.id) {
      let data = columnsDetailData.find((e) => {
        if (e.id === parseInt(req.params.id)) {
          return e
        }
      })
      res.send(data);
    } else {
      // TODO 抛出异常
    }
  }
  async getColumnBlogs (req, res, next) {
    if (req.params.id) {
      let data = columnsBlogsData.find((e) => {
        if (e.id === parseInt(req.params.id)) {
          return e
        }
      })
      res.send(data ? data.blogs : '');
    } else {
      // TODO 抛出异常
    }
  }
  async addColumn (req, res, next) {
    res.render('index', { title: 'addColumn 页面' })
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
