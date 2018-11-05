'use strict'

import Base from './common/base'
import users from '../models/users'

class Login extends Base {
  constructor() {
    super()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.logout = this.logout.bind(this)
    this.visitor = this.visitor.bind(this)
    this.resetpw = this.resetpw.bind(this)
  }
  async login (req, res, next) {
    if (req.session.user_id) {
      throw new Error('需要先退出用户才能登录')
    }
    let { user_name, password } = req.body
    if (!user_name) {
      throw new Error('账号不能为空')
    }
    if (!password) {
      throw new Error('账号不能为空')
    }
    let user = await users.findOne({user_name: user_name })
    if (!user) {
      throw new Error('账户或密码错误')
    }
    if (this.encryption(password) != user.password) {
      throw new Error('账户或密码错误')
    }
    // 登录成功,
    // 将用户信息保存到session中
    req.session.user_id = user.id
    // TODO 插入登录历史记录
    res.send(this.succ('登录成功'))
  }
  /**
   * 游客登录.
   */
  async visitor (req, res, next) {
    if (req.session.user_id) {
      throw new Error('需要先退出用户才能以游客身份登录')
    }
    let { nick_name, email, user_avatar } = req.body
    if (!nick_name) {
      throw new Error('名称不能为空')
    }
    let id = await this.getId()
    let user = {
      id: id,
      nick_name: nick_name,
      email: email,
      user_avatar: user_avatar
    }
    await users.create(user)
    req.session.user_id = user.id
    req.session.visitor = true
    res.send(this.succ('游客登录成功'))
  }
  /**
   * 注销
   */
  async logout (req, res, next) {
    if (!req.session.user_id) {
      throw new Error('登录后才能注销')
    }
    delete req.session.user_id
    res.send(this.succ('已注销'))
  }
  /**
   * 注册方法.
   * 存在邮箱注册与账号注册两种类型.
   * 账号与邮箱不能重复.
   * 邮箱注册时,需要回写正确的邮箱验证码.
   * 注册只有账号/邮箱,密码.
   */
  async register (req, res, next) {
    // 校验入参是否合法:user_name,password,is_email,
    if (req.session.user_id) {
      throw new Error('需要先退出用户才能注册')
    }
    let { user_name, password, is_email } = req.body
    if (!user_name) {
      throw new Error('账号不能为空')
    }
    if (!password) {
      throw new Error('密码不能为空')
    }
    // 账号注册
    let user = await users.findOne({ user_name: user_name })
    if (user) {
      throw new Error(is_email ? '该邮箱已被注册' : '该账号已被注册')
    }
    let id = await this.getId()
    let newPassword = this.encryption(password)
    user = {
      id: id,
      user_name: user_name,
      password: newPassword
    }
    // 邮箱注册,用户名和邮箱字段是一致的.
    if (is_email) {
      user.email = user.user_name
      // TODO 发送邮件.
    }
    await users.create(user)
    res.send(this.succ('注册成功'))
  }
  async resetpw (req, res, next) {
    
  }
}

export default new Login()
