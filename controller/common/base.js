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
  }
  async getSeq (req, res, next) {
    let id = await this.getId(req.params.type)
    res.send({id: id})
  }
  encryption (text) {
    const hash = crypto.createHash('md5')
    return hash.update(text + config.salt).digest('base64')
  }
  copy (orig, dist) {
    // TODO
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
