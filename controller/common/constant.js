'use strict'

const constant = {
  blog_status: {
    draft: 'DRAFT', //-草稿,
    publish: 'PUBLISH', //-已发布,
    trash: 'TRASH', //-垃圾桶,
    deleted: 'DELETED', //-已删除
  },
  blog_his_oper: {
    add: 'ADD', // 新增
    update: 'UPDATE', // 更新
    trash: 'TRASH', // 移动到垃圾桶
    reversion: 'REVERSION', // 回复
    publish: 'PUBLISH', // 发版
    updatePub: 'UPDATEPUB', // 更新发版
    cancelPub: 'CANCELPUB', // 取消更新
    delete: 'DELETE', // 删除
  },
  tag_type: {
    tag: 'TAG', //标签
    topic: 'TOPIC' //话题
  }
}

export default constant