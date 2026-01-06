import request from '@/utils/request'

export const getEverydayRecommendApi = () => {
  return request({
    url: '/everyday/recommend',
    method: 'GET'
  })
}

/**
 * 歌单分类
 * @param { Object } params - 请求参数对象
 * @param { number } params.category_id - 分类ID,必选,默认 0
 * @param { number } params.withsong - 是否包含歌曲,可选,0：不包含，1：包含，默认 0
 * @param { number } params.withtag - 是否包含分类, 可选,0：不包含，1：包含，默认 0
 * @returns {Promise} - 返回包含歌单分类的Promise对象
 */
export const getSpecialListApi = (params = {}) => {
  params = {
    category_id: params.category_id || 0,
    ...params
  }
  return request({
    url: '/top/playlist',
    method: 'GET',
    params
  })
}

/**
 * 首页轮播推荐
 * @returns {Promise} - 返回包含首页轮播推荐的Promise对象
 */
export const getHomeBannerApi = () => {
  return request({
    url: '/top/card?card_id=3',
    method: 'GET'
  })
}
