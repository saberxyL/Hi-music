import request from '@/utils/request'

/**
 * 获取歌单详情
 * @param { Array } ids - 歌单global_collection_id数组,必选
 * @returns {Promise} - 返回包含歌单详情的Promise对象
 */
export const getMusicListDetailApi = (ids = []) => {
  ids = ids.join(',')
  return request({
    url: '/playlist/detail',
    method: 'GET',
    params: {
      ids
    }
  })
}

/**
 * 获取歌单所有歌曲
 * @param { Object } params - 请求参数对象
 * @param { number } params.id - 歌单中的global_collection_id,必选
 * @param { number } params.page - 页码,可选,默认 1
 * @param { number } params.pagesize - 每页数量,可选,默认 30
 * @returns {Promise} - 返回包含歌单所有歌曲的Promise对象
 */
export const getMusicListSongsApi = (params = {}) => {
  return request({
    url: `/playlist/track/all`,
    method: 'GET',
    params
  })
}

/**
 * 获取歌单所有歌曲（新版）,目前用于用户收藏和创建的歌单
 * @param { Object } params - 请求参数对象
 * @param { number } params.listid - 歌单中的listid,必选
 * @param { number } params.page - 页码,可选,默认 1
 * @param { number } params.pagesize - 每页数量,可选,默认 30
 * @returns {Promise} - 返回包含歌单所有歌曲的Promise对象
 */
export const getMusicListSongsNewApi = (params = {}) => {
  return request({
    url: `/playlist/track/all/new`,
    method: 'GET',
    params
  })
}
