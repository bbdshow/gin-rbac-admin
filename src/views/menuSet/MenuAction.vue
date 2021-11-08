<template>
  <div class="ubn wd-100 ub-ver" style="padding:20px;">
    <div class="ubn">菜单管理</div>
    <div class="ubn mar-t20">{{nodeInfo.path}} {{nodeInfo.status === 1?'':'已限制'}}</div>
    <el-form inline class="mar-t20">
      <el-form-item>
        <el-button type="primary" :disabled="!menuId" @click="actionClc('modify')">修改页面</el-button>
        <el-button type="danger" :disabled="!menuId" @click="delClc">删除页面</el-button>
        <el-button type="success" :disabled="!menuId || type===1 || actionList.length>0" @click="actionClc('add')">添加子页面</el-button>
        <el-button type="success" :disabled="!menuId || type === 2" @click="actionClc('action')">添加功能</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="actionList">
      <el-table-column label="ID" prop="id" width="50px"></el-table-column>
      <el-table-column label="AppId" prop="appId" width="100px"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Path" prop="path"></el-table-column>
      <el-table-column label="Method" prop="method" width="100px"></el-table-column>
      <el-table-column label="操作" v-slot="{row}">
        <el-button @click="delAction(row)" type="text">删除</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { axiosPost } from '@/assets/api/http'
import code from '@/assets/api/code'
import confirm from '@/assets/utils/confirm'
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, content) {
    const state = reactive({
      actionList: [],
      dialogData: {}
    })
    const nodeInfo = computed(() => props.info || {})
    const menuId = computed(() => nodeInfo.value.id || false)
    const actions = computed(() => nodeInfo.value.actions || [])
    const type = computed(() => nodeInfo.value.typ)

    const getActionsInfo = () => {
      const list = actions.value
      if (list.length === 0) {
        state.actionList = []
        return
      }
      return axiosPost('actionFind', { actionId: list, appId: nodeInfo.value.appId }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.actionList = res.data.actions
        }
      })
    }
    const delAction = ({ id }) => {
      const [...arr] = actions.value
      const data = arr.filter(num => num !== id)
      console.log('del', data)
      confirm('menuActionUpdate', { menuId: menuId.value, actionId: data }).then(res => {
        console.log('reloadTree>>>>>')
        content.emit('reloadTree')
      })
    }

    const actionClc = (actionType) => {
      const data = nodeInfo.value
      console.log('==>', data)
      const { id, memo, name, parentId, path, sequence, typ, appId, status } = data
      console.log('==> status', status)
      content.emit('menuAction', { actionType, id, memo, name, parentId, path, sequence, typ, appId, status })
    }

    const delClc = () => { // 删除页面
      const id = menuId.value
      return confirm('menuDel', { id }).then(res => {
        if (res?.code === code.SUCCESS) {
          content.emit('reloadTree')
        }
      })
    }

    watch([menuId, actions], getActionsInfo)
    return {
      nodeInfo,
      menuId,
      ...toRefs(state),
      delAction,
      actionClc,
      delClc,
      type
    }
  }
}
</script>

<style>

</style>
