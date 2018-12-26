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
    deleted: 'DELETED', // 删除
  },
  comment_status: {
    normal: 'NORMAL', // 正常
    update: 'UPDATE', // 修改过
    deleted: 'DELETED', // 删除了
    flod: 'FLOD', // 被折叠了
  },
  comment_rela_type: {
    feed: 'FEED', // 关联feed
    blog: 'BLOG', // 关联blog
  },
  thumb_status: {
    normal: 'NORMAL', // 正常
    deleted: 'DELETED', // 删除了
  },
  thumb_rela_type: {
    feed: 'FEED', // 关联feed
    blog: 'BLOG', // 关联blog
    comment: 'COMMENT', // 关联comment
    user: 'USER' // 关联用户
  },
  tag_type: {
    tag: 'TAG', //标签
    topic: 'TOPIC' //话题
  }
}

export default constant