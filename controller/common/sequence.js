'use strict'

import seq from '../../models/sequence'

class Sequence {
  constructor(){
    this.getId = this.getId.bind(this)
    // this.getSeq = this.getSeq.bind(this)
  }
  /*async getSeq (req, res, next) {
    // 如果要调用自身的方法或从父类继承来的方法,需要在构造器中将方法(调用者与被调用者都要)绑定到this中.
    let id = await this.getId(req.params.type)
    res.send({id: id})
  }*/
  async getId (type) {
    if (!type) {
      type = 'commons'
    }
    try {
      let seqData = await seq.findOne()
      seqData[type] ++
      await seqData.save()
      return seqData[type]
    } catch (err) {
      console.log('获得id失败')
      throw new Error(`获得id失败,失败原因:${err}`)
    }
  }
}

export default Sequence
