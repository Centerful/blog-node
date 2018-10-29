'use strict'

import Sequence from './sequence'

class Base extends Sequence{
  constructor(){
    super()
    this.getSeq = this.getSeq.bind(this)
  }
  async getSeq (req, res, next) {
    let id = await this.getId(req.params.type)
    res.send({id: id})
  }
}

export default Base
