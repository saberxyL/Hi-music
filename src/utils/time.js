/**
 * 格式化时间，单位为秒，格式为 mm:ss
 * @param {number} time - 时间，单位为秒
 * @returns {string} 格式化后的时间字符串, 格式为 mm:ss
 */
export const formatTimeFromSecond = time => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 格式化时间，单位为毫秒，格式为 mm:ss
 * @param {number} time - 时间，单位为毫秒
 * @returns {string} 格式化后的时间字符串, 格式为 mm:ss
 */
export const formatTimeFromMillisecond = time => {
  const totalSeconds = Math.floor(time / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

console.log(formatTimeFromMillisecond(44400))
console.log(formatTimeFromMillisecond(185730))
