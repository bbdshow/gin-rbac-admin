import { ElMessageBox } from 'element-plus'
import { axiosPost } from '@api/http'

export default (portName, data, txt = '你确定要进行该操作吗?') => {
  return ElMessageBox.confirm(
    txt,
    '确认'
  )
    .then(() => {
      return axiosPost(portName, data)
    })
    .catch((err) => {
      console.log(err)
    })
}
