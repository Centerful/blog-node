'use strict'

const Math = require('mathjs')

class Sequence {
  constructor(){}
  async getSeq (req, resp, next) {
    resp.send({ id: Math.floor(Math.random() * 100000 + 1) })
  }
}

export default new Sequence()
