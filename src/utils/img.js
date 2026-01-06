/**
 * 通用的图片 URL 尺寸处理函数
 * @param {string} urlTemplate - 包含 {size} 占位符的原始 URL 字符串
 * @param {string} size - 你想要设置的尺寸，例如 '200', '400', '800' 等
 * @returns {string} - 替换尺寸后的完整 URL
 */
export function replaceImageSize(urlTemplate = '', size) {
  // 使用正则表达式 /{size}/g 来查找并替换所有的 {size} 占位符
  // 'g' 标志表示全局替换（global），以防 URL 中有多个占位符
  return urlTemplate.replace(/{size}/g, size)
}
