
module.exports = {
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV !== 'production',
  assetsDir: 'static',
  runtimeCompiler: true,
  // productionSourceMap: false,
  productionSourceMap: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@cps', '@/components')
      .set('@views', '@/views')
      .set('@utils', '@/assets/utils')
      .set('@api', '@/assets/api')
  },
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.externals = {
  //       vue: 'Vue', // 配置使用CDN vue
  //       vuex: 'Vuex',
  //       axios: 'axios',
  //       'vue-router': 'VueRouter',
  //       'vue-i18n': 'VueI18n',
  //       vconsole: 'VConsole',
  //       'element-plus': 'ElementPlus',
  //       'bignumber.js': 'BigNumber'
  //       // web3: 'Web3'
  //       // '@metamask/detect-provider': 'detectEthereumProvider'
  //     }
  //   }
  // },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.10.250:49000/',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
}
