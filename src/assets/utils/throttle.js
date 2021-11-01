const genThrottle = (time = 500) => { // 生成一个
  let timmer = null
  return (func) => {
    if (timmer) {
      clearTimeout(timmer)
      timmer = null
    }
    timmer = setTimeout(func, time)
  }
}
export default genThrottle
