// import store from './store'
import { MessageBox, Message } from 'element-ui'
import { authSelf } from '@/api/user'
import store from '@/store'

export default {
  install(Vue, options) {
    // 4. 添加实例方法
    Vue.prototype.$requireAuth = function() {
      return new Promise(function(resolve, reject) {
        // 据离上次认证时间有效免认证时间为3分钟
        const lastAuthTime = store.getters.lastAuthTime
        const now = new Date()
        const t = now.getTime()
        const betweenMinutes = Math.floor((t - lastAuthTime) / (1000 * 60))
        if (betweenMinutes < 3) {
          store.commit('app/SET_LAST_AUTH_TIME')
          resolve()
          return
        }

        // 做一些异步操作
        MessageBox.prompt('请输入密码', '认证', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'password',
          beforeClose(type, promptObj, close) {
            if (type !== 'confirm') {
              close()
              return
            }
            if (!promptObj.inputValue) {
              Message({
                message: '请输入密码',
                type: 'error',
                duration: 5 * 1000
              })
              return
            }
            authSelf(promptObj.inputValue).then(data => {
              if (data === 'SUCCESS') {
                store.commit('app/SET_LAST_AUTH_TIME')
                close()
                setTimeout(() => {
                  resolve()
                }, 1)
              } else {
                reject()
              }
            }).catch(() => {
            })
          }
        }).catch(() => {

        })
      })
    }
  }
}
