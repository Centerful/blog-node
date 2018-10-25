'use strict'

class Column {
  constructor(){}
  async getColumns (req, res, next) {
    // get请求中?后边的参数
    // post请求中body中的参数
    // json请求中的json对象.
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'getColumns 页面' })
  }
  async getColumnById (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'getColumnById 页面' })
  }
  async addColumn (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'addColumn 页面' })
  }
  async updateColumn (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'updateColumn 页面' })
  }
  async patchColumn (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'patchColumn 页面' })
  }
  async deleteColumn (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'deleteColumn 页面' })
  }
  async getColumnBlogs (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'getColumnBlogs 页面' })
  }
  async blogRemove (req, res, next) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.render('index', { title: 'blogRemove 页面' })
  }
}

export default new Column()
