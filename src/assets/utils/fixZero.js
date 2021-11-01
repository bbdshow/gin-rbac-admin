const reg = /(?:\.0*|(\.\d+?)0+)$/
const fixZero = (str) => {
  if (typeof str !== 'string') {
    str = `${str || 0}`
  }
  return str.replace(reg, '$1')
}
export default fixZero
