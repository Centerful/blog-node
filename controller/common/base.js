'use strict'

import Sequence from './sequence'
import crypto from 'crypto'
const config = require('config-lite')(__dirname)
import formidable from 'formidable'
import fs from 'fs'

class Base{
  constructor(){
    this.addImages = this.addImages.bind(this)
    this.guid = this.guid.bind(this)
    this.md5 = this.md5.bind(this)
    this.checkUserAuth = this.checkUserAuth.bind(this)
    this.encryption = this.encryption.bind(this)
    this.succ = this.succ.bind(this)
    this.fail = this.fail.bind(this)
    this.copy = this.copy.bind(this)
    this.dcopy = this.dcopy.bind(this)
    this.ccopy = this.ccopy.bind(this)
    this.accopy = this.accopy.bind(this)
    this.throwEx = this.throwEx.bind(this)
  }
  /**
   * 添加图片
   * TODO 本地output图片时，先判断图片是否存在，存在则直接return路径
   * 将图片缩放成几种不同大小的格式，缩放的规则配置在config文件中。
   * 命名规范：guid + width_height + type
   */
  async addImages (req, res, next) {
    let data = new formidable.IncomingForm()
    data.parse(req, (err, fields, files) => {
      console.log(files)
      console.log(fields)
      console.log(files.file.path)
      let file = fs.readFileSync(files.file.path)
      let fileName = this.md5(file) + files.file.name.substring(files.file.name.lastIndexOf('.'))
      fs.writeFileSync(`public/images/${fileName}`, file)
      res.send(this.succ('', {path: `http://localhost:3000/public/images/${fileName}`}))
    })
  }
  guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
  }
  md5 (file) {
    let hash = crypto.createHash('md5')
    return hash.update(file).digest('hex')
  }
  encryption (text) {
    let hash = crypto.createHash('md5')
    return hash.update(text + config.passwordSalt).digest('base64')
  }
  /**
   * 用户权限检测
   */
  checkUserAuth (req) {
    if (!req.session.user_id || req.session.visitor) {
      throw new Error('用户登录后才能进行此操作')
    }
  }
  throwEx (msg) {
    throw new Error(msg)
  }
  /**
   * 浅拷贝
   */
  copy (orig) {
    let dist = {}
    for (let attr in orig) {
      dist[attr] = orig[attr]
    }
    return dist
  }
  /**
   * 深拷贝
   */
  dcopy (orig) {
    if (typeof orig != 'object') {
      return orig
    }
    let dist = {}
    for ( let attr in orig) {
      dist[attr] = this.dcopy(orig[attr])
    }
    return dist
  }
  /**
   * 限定拷贝
   */
  ccopy (orig, temp) {
    let dist = {}
    for (let attr in temp) {
      dist[attr] = orig[attr]
    }
    return dist
  }
  /**
   * 数组限定拷贝
   */
  accopy (orig, temp) {
    let dist = []
    for (let obj in orig) {
      dist.push(ccopy(obj, temp))
    }
    return dist
  }
  succ (message, data) {
    return {
      code: 0,
      data: data,
      message: message
    }
  }
  fail (message, data) {
    return {
      code: 1,
      data: data,
      message: message
    }
  }
}

export default Base
