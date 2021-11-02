import m from 'moment'

const fTime = (stamp) => {
  if (!stamp) {
    return ''
  }
  return m(stamp * 1000).format('YYYY-MM-DD  HH:mm:ss')
}
export default fTime
