import { ref } from 'vue'
import { axiosPost } from '@/assets/api/http'

export default () => {
  const form = ref(null)
  const checkPost = (portName, params, config) => {
    return new Promise((resolve, reject) => {
      return form.value.validate((valid) => {
        console.log('valid', valid)
        if (valid) {
          console.log('pass')
          return axiosPost(portName, params, config).then(res => {
            resolve(res)
          })
        } else {
          console.log('not pass')
          return reject(new Error('校验不通过'))
        }
      })
    })
  }
  return {
    form,
    checkPost
  }
}
