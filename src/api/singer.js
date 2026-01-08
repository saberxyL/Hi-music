import request from '@/utils/request'

/**
 * 获取歌手列表
 * @param { Object } params - 请求参数对象，可选
 * @param { number } params.sextypes - 性别类型，0：全部，1：男，2：女，3：组合
 * @param { number } params.type - 类型，0：全部，1：华语，2：欧美，3：日韩，4：其他，5：日本，6：韩国
 * @param { number } params.musician - 音乐人, 3: 为音乐人，0：默认
 * @param { number } params.hotsize: 返回热门数量，默认为30
 */

export const getSingerListApi = (params = {}) => {
  return request({
    url: '/artist/lists',
    method: 'GET',
    params
  })
}

/**
 * 获取歌手详情
 */

export const getSingerDetailApi = id => {
  return request({
    url: '/artist/detail',
    method: 'GET',
    params: {
      id
    }
  })
}

/**
 * 获取歌手专辑
 * @param { Object } params - 请求参数对象
 * @param { number } params.id - 歌手id，必选
 * @param { number } params.page - 页码，默认1，可选
 * @param { number } params.pagesize - 每页数量，默认30，可选
 * @param { string } params.sort - 排序，hot:热门, new:最新, 可选
 */

export const getSingerAlbumApi = (params = {}) => {
  return request({
    url: '/artist/albums',
    method: 'GET',
    params
  })
}

/**
 * 获取歌手单曲
 * @param { Object } params - 请求参数对象
 * @param { number } params.id - 歌手id，必选
 * @param { number } params.page - 页码，默认1，可选
 * @param { number } params.pagesize - 每页数量，默认30，可选
 * @param { string } params.sort - 排序，hot:热门, new:最新, 可选
 * @returns {Promise} - 返回包含歌手单曲的Promise对象
 */

export const getSingerSongsApi = (params = {}) => {
  return request({
    url: '/artist/audios',
    method: 'GET',
    params
  })
}
