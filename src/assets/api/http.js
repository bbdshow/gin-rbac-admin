import Axios from './axios'
import Rs from './rs'
// import store from '@/store'
import qs from 'qs'

const axiosPost = (pStr, params, config = {}) => {
  // store.commit('setLoadingStatus', true)
  const port = `${Rs[pStr]}`
  return Axios.post(port, params, config)
  // .finally(() => { store.commit('setLoadingStatus', false) })
}

const axiosGet = (pStr, parm, config = {}) => {
  // store.commit('setLoadingStatus', true)
  let port = `${Rs[pStr]}`
  if (parm) {
    port = `${port}?${qs.stringify(parm)}`
  }
  // console.log('port')
  // console.log(port)
  return Axios.get(port, config)
  // .finally(() => { store.commit('setLoadingStatus', false) })
}

export {
  axiosPost,
  axiosGet
}
