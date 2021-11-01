import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    token: '',
    appId: '000000',
    auth: []
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setAuth (state, arr) {
      state.auth = arr || []
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({ storage: window.localStorage })]
})
