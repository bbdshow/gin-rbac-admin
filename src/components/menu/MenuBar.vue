<script>
import { computed, h, resolveComponent } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    const $state = useStore().state
    const auth = computed(() => $state.auth)
    console.log('auth', auth.value)
    const renderMenu = () => {
      return h(resolveComponent('el-menu'), { class: 'ht-100 wd-100', backgroundColor: '#3B5A99', textColor: '#fff', activeTextColor: '#ffd04b', router: true }, { default: () => renderMenuByInfo(auth.value) })
    }

    const renderMenuByInfo = (info = []) => {
      const res = []
      for (const menu of info) {
        const path = menu.path
        const type = menu.typ
        const id = menu.id
        const children = menu.children || []
        const name = menu.name
        console.log(type)
        let rObj
        if (type !== 1 && type !== 2) {
          continue
        }
        if (type === 2) {
          rObj = h(resolveComponent('el-sub-menu'), { index: `sub_menu_${id}` }, { default: () => renderMenuByInfo(children), title: () => h('span', name) })
        }
        if (type === 1) {
          rObj = h(resolveComponent('el-menu-item'), { index: `menu_item_${id}`, route: path }, { default: () => name })
        }
        if (rObj) {
          res.push(rObj)
        }
      }
      console.log('res', res)
      return res
    }

    return renderMenu
  }
}
</script>
