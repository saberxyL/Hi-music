import request from '@/utils/request'
/**
 * 获取排行榜列表
 *
 */

export const getTopList = async () => {
  return request({
    url: '/rank/list',
    method: 'GET'
  })
}
