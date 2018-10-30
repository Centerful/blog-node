'use strict'

import Base from './common/base'
import users from '../models/users'

class Login extends Base{
  constructor(){
    super()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
  }
  async login (req, res, next) {
    let data = req.body
    if (!data.user_name) {
      throw new Error('账号不能为空')
    }
    if (!data.password) {
      throw new Error('账号不能为空')
    }
    let user = await users.findOne({user_name: data.user_name })
    if (!user) {
      throw new Error('账户或密码错误')
    }
    if (this.encryption(data.password) === user.password) {
      throw new Error('账户或密码错误')
    }
    // 登录成功,
    // TODO session状态修改.
    // TODO 插入登录历史记录
    res.send(this.succ('登录成功'))
  }
  async logout (req, res, next) {
    
  }
  /**
   * 注册方法.
   * 存在邮箱注册与账号注册两种类型.
   * 账号与邮箱不能重复.
   * 邮箱注册时,需要回写正确的邮箱验证码.
   * 注册只有账号/邮箱,密码.
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async register (req, res, next) {
    // 校验入参是否合法:user_name,password,is_email,
    let data = req.body
    if (!data.user_name) {
      throw new Error('账号不能为空')
    }
    if (!data.password) {
      throw new Error('密码不能为空')
    }
    // 账号注册
    let user = await users.findOne({ user_name: data.user_name })
    if (user) {
      throw new Error(data.is_email ? '该邮箱已被注册' : '该账号已被注册')
    }
    let id = await this.getId()
    let password = this.encryption(data.password)
    user = {
      id: id,
      user_name: data.user_name,
      password: password
    }
    // 邮箱注册,用户名和邮箱字段是一致的.
    if (data.is_email) {
      user.email = data.user_name
    }
    await users.create(user)
    res.send(this.succ('注册成功'))
  }
  async resetpw (req, res, next) {
    
  }
}

export default new Login()
