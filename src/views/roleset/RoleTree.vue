<template>
  <el-tree :data="menu" lazy :load="loadNode" :props="{label:'name', children:'children', isLeaf:setIsLeaf, disabled: checkType}" node-key="id" show-checkbox :default-checked-keys="defaultKeys" @check-change="checkChange" ref="tree" check-strictly>
    <template #default="{ data }">
      <div class="ubn">
        <span class="wd-100" >
          {{ data.name}}
        </span>
        <!-- <role-page-check v-if="data.typ === 1" :info="data" :actions="menuMap[data.id]" ></role-page-check> -->
      </div>
    </template>
  </el-tree>
  <!-- {{defaultKeys}} -->
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { axiosGet, axiosPost } from '@/assets/api/http'
// import RolePageCheck from './RolePageCheck.vue'
import code from '@/assets/api/code'
export default {
  // components: { RolePageCheck },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    appId: {
      type: String,
      default: ''
    }
  },
  setup (props, content) {
    const state = reactive({
      menu: [],
      menuIdMap: {}
    })
    const appId = computed(() => props.appId)
    // 获取菜单
    const getMenu = () => {
      return axiosGet('menuTree', { appId: appId.value }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.menu = res.data.dirs
        }
      })
    }
    getMenu()
    // 已绑定action 映射map
    const userActions = computed(() => props.modelValue)
    const menuMap = computed({
      get () {
        const map = {}
        userActions.value.forEach(info => {
          const menuId = info.menuId
          const [...actions] = info.actions
          map[menuId] = actions
        })
        return map
      }
    })

    const loadNode = (node, resolve) => {
      // console.log(node.data)
      const data = node.data
      const children = data.children || []
      const actions = data.actions || []
      const menuId = data.id
      state.menuIdMap[menuId] = true // 记录
      if (children.length > 0) {
        return resolve(children)
      }
      if (actions.length > 0) { // 动态加载 action的信息
        axiosPost('actionFind', { appId: props.appId, actionId: actions }).then(res => {
          if (res?.code === code.SUCCESS) {
            const list = res.data.actions.map(action => {
              const { appId, id, method, name, path, status } = action
              const obj = {
                children: [],
                actions: [],
                appId,
                id: `${menuId}_${id}`,
                method,
                name,
                path,
                status,
                typ: 3,
                menuId // 这个可以最后来找
              }
              return obj
            })
            resolve(list)
          }
        })
      }
      return resolve([])
    }
    const setIsLeaf = (data) => {
      // console.log('isLeaf', data, data.typ)
      return data.children?.length === 0 && data.actions?.length === 0
    }

    const defaultKeys = computed(() => {
      const menuActions = props.modelValue || []
      const arr = []
      for (const obj of menuActions) {
        const { actions, menuId } = obj
        for (const id of actions) {
          arr.push(`${menuId}_${id}`)
        }
      }
      return arr
    })

    const unrenderArr = () => {
      const list = userActions.value
      const arr = []
      for (const info of list) {
        const { menuId, actions } = info
        if (state.menuIdMap[menuId] === undefined) {
          arr.push({ menuId, actions })
        }
      }
      return arr
    }

    const checkChange = (...data) => {
      console.log('checkChange', data)
      const nodes = tree.value.getCheckedKeys(true)
      console.log('nodes', nodes)
      const map = {}
      const arr = []
      for (const id of nodes) {
        console.log(id)
        if (typeof id !== 'string' || id.indexOf('_') === -1) {
          console.log('out>>')
          continue
        }
        const ids = id.split('_')
        const menuId = ids[0]
        const aId = Number(ids[1])
        if (map[menuId] !== undefined) {
          map[menuId].push(aId)
        } else {
          map[menuId] = [aId]
        }
      }
      for (const menuId in map) {
        const actions = map[menuId]
        arr.push({ menuId: Number(menuId), actions })
      }
      const res = arr.concat(unrenderArr())
      console.log('arr>>>', res)
      content.emit('update:modelValue', res)
    }

    const checkType = (data) => {
      return data.typ === 1 || data.typ === 2
    }

    watch(appId, getMenu)
    const tree = ref(null)
    return {
      ...toRefs(state),
      menuMap,
      loadNode,
      setIsLeaf,
      defaultKeys,
      checkChange,
      tree,
      checkType
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
