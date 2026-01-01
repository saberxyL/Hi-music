import request from '@/utils/request'

/**
 * 手机号登录
 * @param { Object }  params
 * @param { Number } params.phone -手机号
 * @param { String } params.password -密码
 * @param { Number } params.countrycode -国家码，用于国外手机号登录，例如美国传入：1
 * @returns data
 */
export const loginCellphoneApi = params => {
  return request({
    url: '/login/cellphone',
    method: 'GET',
    params
  })
}

/**
 * 注册修改密码
 * @param { Object }  params
 * @param { Number } params.phone -手机号
 * @param { String } params.password -密码
 * @param { Number } params.captcha -验证码
 * @param { Number } params.countrycode -国家码，用于国外手机号登录，例如美国传入：1
 * @returns data
 */
export const registerOrChangePasswordApi = params => {
  return request({
    url: '/register/cellphone',
    method: 'GET',
    params
  })
}
