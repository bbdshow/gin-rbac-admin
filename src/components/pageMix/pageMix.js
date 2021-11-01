import code from '@/assets/api/code'
import { axiosPost, axiosGet } from '@api/http'
import { ref, reactive, provide, watch } from 'vue'
import confirm from '@/assets/utils/confirm'

const genPage = ({ pageName = 'page', sizeName = 'size', totalName = 'count', dataName = 'list', symbol = 'page_ui' } = {}) => {
  const total = ref(0)
  const page = ref(1)
  const size = ref(10)
  const tableData = ref([])

  const sForm = reactive({})
  let sFormData = {}

  const mixPortName = ref('')
  const mixHttpPost = ref(false)
  const mixFunc = ref(null)

  const dSearch = (portName, httpPost = false, func) => { // 设置并搜索
    mixPortName.value = portName
    mixHttpPost.value = httpPost
    mixFunc.value = func
    const http = httpPost ? axiosPost : axiosGet
    const params = Object.assign({}, { ...sForm }, { [pageName]: page.value, [sizeName]: size.value })
    return http(portName, params).then(res => {
      if (res?.code === code.SUCCESS) {
        (func || setTableData)(res)
      }
    })
  }

  const search = () => { // 搜索
    return dSearch(mixPortName.value, mixHttpPost.value, mixFunc.value)
  }
  const pSearch = () => { // 普通搜索
    resetPage()
    return search()
  }

  const rSearch = () => { // 重置搜索
    resetForm()
    resetPage()
    return search()
  }

  const setTableData = (res) => {
    const rdata = res.data
    total.value = rdata[totalName]
    tableData.value = rdata[dataName]
  }

  const setForm = (data) => {
    sFormData = data
    for (const key in data) {
      sForm[key] = ref(data[key])
    }
  }

  const resetForm = () => {
    for (const key in sFormData) {
      sForm[key] = sFormData[key]
    }
  }
  const resetPage = () => {
    page.value = 1
    size.value = 10
    total.value = 0
  }
  const setPageInfo = ({ page: uiPage, size: uiSize, total: uiTotal }) => {
    console.log(uiPage, uiSize, uiTotal)
    if (uiPage !== undefined) {
      page.value = uiPage
    }
    if (uiSize !== undefined) {
      size.value = uiSize
    }
    if (uiTotal !== undefined) {
      total.value = uiTotal
    }
    console.log(page.value, size.value, total.value)
  }

  const genForm = () => {
    const formRef = ref(null)
    const checkPost = (portName, params, config) => {
      return new Promise((resolve, reject) => {
        return formRef.value.validate((valid) => {
          console.log('valid', valid)
          if (valid) {
            console.log('pass')
            return axiosPost(portName, params, config).then(res => {
              search()
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
  const confirmAction = (portName, data, txt) => {
    return confirm(portName, data, txt).then(res => {
      if (res?.code === code.SUCCESS) {
        search()
      }
      return res
    })
  }
  provide(Symbol.for(symbol), { page, size, total, setPageInfo, pSearch, rSearch })

  watch(page, search)
  watch(size, rSearch)

  return {
    total,
    page,
    size,
    setPageInfo,
    dSearch,
    tableData,
    sForm,
    setForm,
    resetForm,
    search,
    pSearch,
    rSearch,
    genForm,
    confirmAction
  }
}

export default genPage
