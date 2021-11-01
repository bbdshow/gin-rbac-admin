<template>
  <el-pagination class="page" background layout="total, prev, pager, next, sizes" :page-sizes="[10, 20]" :total="total" v-model:pageSize="setPageSize" v-model:currentPage="setPage"></el-pagination>
</template>

<script>
import { computed, inject } from 'vue'
// import { computed } from 'vue'
export default {
  props: {
    symbol: {
      type: String,
      default: 'page_ui'
    }
  },
  setup (props) {
    const { page, size, total: mixTotal, setPageInfo } = inject(Symbol.for(props.symbol))
    const setPage = computed({
      get () {
        return page.value
      },
      set (value) {
        setPageInfo({ page: value })
      }
    })
    const setPageSize = computed({
      get () {
        return size.value
      },
      set (value) {
        setPageInfo({ size: value })
      }
    })

    const total = computed(() => {
      return mixTotal.value
    })
    return {
      total,
      setPage,
      setPageSize
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  margin-top: 20px;
}
</style>
