import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import '@/assets/css/common.scss'

import PageUi from '@cps/pageMix/PageUi'
import SBtn from '@cps/pageMix/btn/SBtn'
import RBtn from '@cps/pageMix/btn/RBtn'
import DBox from '@cps/dBox/DBox.vue'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router)
  .component('page-ui', PageUi)
  .component('d-box', DBox)
  .component('s-btn', SBtn)
  .component('r-btn', RBtn)
  .mount('#app')
