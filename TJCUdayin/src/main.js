// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import theme from 'muse-ui/lib/theme'
import Icon from 'vue-svg-icon/Icon.vue'
import Message from 'muse-ui-message'
import Loading from 'muse-ui-loading'
import uploader from 'vue-simple-uploader'
import store from './vuex'

theme.add('teal', {
  primary: '#17b7eb',
  secondary: '#17b7eb',
  success: '#17b7eb',
  warning: '#17b7eb'
}, 'light')

theme.use('teal')
Vue.use(Message)
Vue.use(Loading)
Vue.use(uploader)
Vue.component('icon', Icon)
Vue.use(MuseUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
