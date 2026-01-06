import request from '@/utils/request'

/**
 * 获取音乐URL
 * @param { Object } params - 请求参数对象
 * @param { number } params.hash - 音乐hash,必选
 * @param { number } params.album_id - 专辑ID,可选
 * @param { number } params.quality - 音质,可选
 * @returns {Promise} - 返回包含音乐URL的Promise对象
 */
export const getMusicUrlApi = params => {
  params = {
    hash: params.hash || '',
    free_part: false
  }
  return request({
    url: `/song/url/new`,
    method: 'GET',
    params
  })
}

/**
 * 获取音乐查询信息
 * @param { String }  hash - 音乐hash,必选
 * @returns {Promise} - 返回包含音乐查询信息的Promise对象
 */
export const getMusicLyricApi = hash => {
  return request({
    url: `/search/lyric?hash=${hash}`,
    method: 'GET'
  })
}

/**
 * 获取音乐歌词
 * @param { Object } params - 请求参数对象
 * @param { String } params.id - 从getMusicLyricApi接口获取到的歌词ID,必选
 * @param { String } params.accesskey - 从getMusicLyricApi接口获取到的accesskey,必选
 * @param { String } params.fmt - 歌词格式,可选, 'lrc'普通歌词, 'krc'卡拉OK歌词
 * @param { Boolean } params.decode - 是否解码,可选, 默认 false
 * @returns {Promise} - 返回包含音乐歌词的Promise对象
 */
export const getLyricApi = params => {
  return request({
    url: `/lyric`,
    method: 'GET',
    params
  })
}
