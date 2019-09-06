//app.js
import http from './utils/http.js'
App({

  stopScroll() {},

  // 登录
  getAuthKey: function() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.login({
        success: res => {
          self.globalData.code = res.code
          wx.getUserInfo({
            success: function(userInfo) {
              const {
                encryptedData,
                iv,
                rawData,
                signature
              } = userInfo
              const wxUserInfo = {
                encryptedData,
                iv,
                rawData,
                signature
              }
              const data = {
                code: res.code,
                wxUserInfo: JSON.stringify(wxUserInfo),
                deviceType: 2,
                deviceName: self.globalData.header.brand,
                deviceNo: 'xiaochengxu'
              }
              http('user/weChatLogin', 'POST', data, '登录中...').then(res => {
                if (res.data.state === 3) {
                  wx.navigateTo({
                    url: '/pages/login/bindPhone/index',
                  })
                } else {
                  self.globalData.userInfo = res.data
                  resolve(res)
                }
              })
            }
          });
        }
      })
    })

  },
  globalData: {
    userInfo: null,
    header: {},
    code: '', // 微信登录code 
  },
})