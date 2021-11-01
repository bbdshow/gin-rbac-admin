import { axiosPost } from '@api/http'
import { ref } from 'vue'
const genForm = () => {
  const formRef = ref(null)
  const checkPost = (portName, params, config) => {
    return new Promise((resolve, reject) => {
      return formRef.value.validate((valid) => {
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
    form: formRef,
    checkPost
  }
}

export default genForm
