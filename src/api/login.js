import request from '@/utils/request'

/**
 * 手机号登录
 * @param { Object }  params
 * @param { Number } params.phone -手机号
 * @param { String } params.password -密码
 * @param { Number } params.countrycode -国家码，用于国外手机号登录，例如美国传入：1
 * @returns data
 */
export const loginCellphoneApi = ({ phone, password, countrycode = 86 }) => {
  const params = { phone, password, countrycode }
  return request({
    url: '/login/cellphone',
    method: 'GET',
    params
  })
}

/**
 * 发送验证码
 * @param { Object } params
 * @param { Number } params.phone -手机号
 * @returns data
 */
export const sendCaptchaApi = params => {
  return request({
    url: '/captcha/sent',
    method: 'GET',
    params
  })
}

/**
 * 验证验证码
 * @param { Object } params
 * @param { Number } params.phone -手机号
 * @param { Number } params.captcha -验证码
 * @param { Number } params.ctcode -国家区号,默认86即中国
 * @returns data
 */
export const verifyCaptchaApi = ({ phone, captcha, ctcode = 86 }) => {
  const params = { phone, captcha, ctcode }
  return request({
    url: '/captcha/verify',
    method: 'GET',
    params
  })
}

/**
 * 邮箱登录
 * @param { Object }  params
 * @param { String } params.email - 163 网易邮箱
 * @param { String } params.password - 密码
 * @returns data
 */
export const loginEmailApi = params => {
  return request({
    url: '/login',
    method: 'GET',
    params
  })
}

/**
 * 注册修改密码
 * @param { Object }  params
 * @param { Number } params.phone -手机号
 * @param { Number } params.captcha -验证码
 * @param { String } params.password -密码
 * @param { String } params.nickname -昵称
 * @param { Number } params.countrycode -国家码，用于国外手机号登录，例如美国传入：1
 * @returns data
 */
export const registerOrChangePasswordApi = ({
  phone,
  captcha,
  password,
  nickname,
  countrycode = 86
}) => {
  const params = { phone, captcha, password, nickname, countrycode }
  return request({
    url: '/register/cellphone',
    method: 'GET',
    params
  })
}

/**
 * 检测手机号码是否已注册
 * @param { Object } params
 * @param { Number } params.phone -手机号
 * @param { Number } params.countrycode -国家码
 * @returns data
 */
export const checkPhoneExistenceApi = ({ phone, countrycode = 86 }) => {
  const params = { phone, countrycode }
  return request({
    url: '/cellphone/existence/check',
    method: 'GET',
    params
  })
}

/**
 * 刷新登录
 * @returns data
 */
export const refreshLoginApi = () => {
  return request({
    url: '/login/refresh',
    method: 'GET'
  })
}

/**
 * 初始化昵称
 * @param { Object } params
 * @param { String } params.nickname -昵称
 * @returns data
 */
export const initNicknameApi = params => {
  return request({
    url: '/activate/init/profile',
    method: 'GET',
    params
  })
}

/**
 * 退出登录
 * @returns data
 */
export const logoutApi = () => {
  return request({
    url: '/logout',
    method: 'GET'
  })
}

/**
 * 登录状态
 * @returns data
 */
export const getLoginStatusApi = () => {
  return request({
    url: '/login/status',
    method: 'GET'
  })
}
