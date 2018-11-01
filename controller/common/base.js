'use strict'

import Sequence from './sequence'
import crypto from 'crypto'
const config = require('config-lite')(__dirname)

class Base extends Sequence{
  constructor(){
    super()
    this.getSeq = this.getSeq.bind(this)
    this.encryption = this.encryption.bind(this)
    this.succ = this.succ.bind(this)
    this.fail = this.fail.bind(this)
    this.copy = this.copy.bind(this)
    this.dcopy = this.dcopy.bind(this)
    this.ccopy = this.ccopy.bind(this)
    this.accopy = this.accopy.bind(this)
  }
  async getSeq (req, res, next) {
    let id = await this.getId(req.params.type)
    res.send({id: id})
  }
  encryption (text) {
    const hash = crypto.createHash('md5')
    return hash.update(text + config.passwordSalt).digest('base64')
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
      dist[attr] = dcopy(orig[attr])
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
