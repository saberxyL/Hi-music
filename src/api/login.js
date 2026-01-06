import request from '@/utils/request'

/**
 * 手机验证码登录
 * @param {Object} params 参数对象
 * @param {string} params.mobile 手机号
 * @param {string} params.code 验证码
 * @param {Number} params.userid 用户id,当用户存在多个账户是时，必须加上需要登录的用户 id
 * @returns {Promise}
 */

export function loginByPhoneCaptchaApi(params) {
  return request({
    url: '/login/cellphone',
    method: 'GET',
    params
  })
}

/**
 * 发送验证码
 * @param {string} mobile 手机号
 * @returns {Promise}
 */
export function sendCaptchaApi(mobile) {
  return request.get(`/captcha/sent?mobile=${mobile}`)
}
