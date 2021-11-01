<template>
  <div class="ubn wd-100 ub-ver ht-100">
    <el-form inline>
      <el-form-item label="选择操作APP" required>
        <app-list v-model="appId"></app-list>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!appId" @click="addRoot">添加目录树</el-button>
      </el-form-item>
    </el-form>
    <div class="ubn">AppId: {{selectId}}</div>
    <el-divider></el-divider>
    <div class="ubn wd-100 flex-1">
      <div class="ubn ub-ver" style="width:300px">
        <div class="ubn">菜单目录</div>
        <menu-tree :menu="menu" class="mar-t20" @nodeClc="nodeClc"></menu-tree>
      </div>
      <div class="ubn ht-100" style="width:1px;background-color:#eee;"></div>
      <div class="ubn flex-1 ub-ver">
        <menu-action :info="nodeInfo" @reloadTree="getMenus" @menuAction="menuAction"></menu-action>
      </div>
    </div>
    <!-- 配置菜单 -->
    <d-box v-model="showDb" :title="type === 'add' ? '新增' : '修改'">
      <template #body>
        <el-form :model="dialogData" :rules="rules" ref="form" label-position="top">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="typ">
            <el-select v-model="dialogData.typ">
              <el-option label="分类" :value="2"></el-option>
              <el-option label="页面" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PATH" prop="path">
            <el-input v-model="dialogData.path"></el-input>
          </el-form-item>
           <el-form-item label="排序" prop="sequence">
            <el-input-number
              :precision="0"
              :min="0"
              v-model="dialogData.sequence"
              :controls="false"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="dialogData.memo"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmClc">确定</el-button>
      </template>
    </d-box>
    <!-- 配置actions -->
    <d-box v-model="showAction" title="添加功能">
      <template #body>
        <el-form
          :model="dialogData"
          :rules="rules"
          ref="fromAction"
          label-position="top"
        >
          <el-form-item label="选择功能" prop="actionId">
            <actions v-model="dialogData.actionId" :appId="appId"></actions>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmActionClc">确定</el-button>
      </template>
    </d-box>
  </div>
</template>

<script>
import { axiosGet } from '@api/http'
import code from '@/assets/api/code'
import { computed, reactive, toRefs, watch } from 'vue'
import appList from './AppList.vue'
import MenuTree from './MenuTree.vue'
import genRules from '@/assets/utils/generateRules'
import genForm from '@cps/pageMix/genForm'
import Actions from './Actions.vue'
import MenuAction from './MenuAction.vue'
export default {
  components: { appList, MenuTree, Actions, MenuAction },
  setup () {
    const state = reactive({
      menu: [],
      appList: [],
      selectId: undefined,
      showDb: false,
      showAction: false,
      dialogData: {},
      rules: genRules(['name', 'sequence', 'typ', 'path']),
      type: '', // add modify delete action
      // nodeInfo: {}
      menuId: ''
    })
    const appId = computed({
      get () {
        return state.selectId
      },
      set (val) {
        console.log('menu', val)
        state.selectId = val
      }
    })
    const { form, checkPost } = genForm()
    const { form: fromAction, checkPost: checkPostAction } = genForm()
    const getMenus = () => {
      return axiosGet('menuTree', { appId: appId.value }).then((res) => {
        if (res?.code === code.SUCCESS) {
          state.menu = res.data.dirs
        }
      })
    }

    const addRoot = () => {
      state.dialogData = {
        name: '',
        appId: appId.value,
        path: '',
        typ: 1,
        sequence: 0,
        memo: '',
        parentId: 0
      }
      state.type = 'add'
      state.showDb = true
    }

    const confirmClc = () => {
      const portName = state.type === 'add' ? 'menuCreate' : 'menuUpdate'
      checkPost(portName, state.dialogData).then((res) => {
        if (res) {
          state.showDb = false
          getMenus()
        }
      })
    }
    const confirmActionClc = () => {
      checkPostAction('menuActionUpdate', state.dialogData).then((res) => {
        if (res) {
          state.showAction = false
          getMenus()
        }
      })
    }

    const menuAction = (info) => {
      const {
        actionType,
        id,
        memo,
        name,
        parentId,
        path,
        sequence,
        typ,
        appId
      } = info
      console.log('menuAction', info)
      state.type = actionType
      if (actionType === 'add') {
        state.dialogData = {
          name: '',
          appId,
          path: '',
          typ: 1,
          sequence: 0,
          memo: '',
          parentId: id
        }
        state.showDb = true
      } else if (actionType === 'modify') {
        state.dialogData = { id, memo, name, parentId, path, sequence, typ }
        state.showDb = true
      } else if (actionType === 'delete') {
      } else if (actionType === 'action') {
        axiosGet('menuActions', { menuId: id }).then((res) => {
          if (res?.code === code.SUCCESS) {
            const actionId = res.data.actions.map((action) => action.id)
            state.dialogData = { menuId: id, actionId, appId: appId.value }
            state.showAction = true
          }
        })
      }
    }

    const nodeClc = (menuId) => {
      state.menuId = menuId
    }

    const nodeInfo = computed(() => {
      const menuId = state.menuId
      if (!menuId) {
        return {}
      }
      return getInfoByMenuId(menuId, state.menu)
    })

    const getInfoByMenuId = (menuId, arr) => {
      for (const item of arr) {
        if (item.id === menuId) {
          return item
        }
        const children = item.children || []
        if (children.length > 0) {
          const res = getInfoByMenuId(menuId, children)
          if (res?.id) {
            return res
          }
        }
      }
      return {}
    }

    watch(appId, getMenus)
    return {
      ...toRefs(state),
      appId,
      addRoot,
      confirmClc,
      form,
      menuAction,
      fromAction,
      checkPostAction,
      confirmActionClc,
      nodeClc,
      getMenus,
      nodeInfo
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
