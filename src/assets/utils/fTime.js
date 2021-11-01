import m from 'moment'

const fTime = (stamp) => {
  if (!stamp) {
    return ''
  }
  return m(stamp * 1000).format('YYYY-MM-DD  hh:mm:ss')
}
export default fTime
