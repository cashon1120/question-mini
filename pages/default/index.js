// pages/default/index.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isSet: true,
    userInfo: {},
    key: '',
    value: '',
  },
  onLoad: function(options) {
    if (options.q) {
      const scene = decodeURIComponent(options.q)
      const arr = scene.split('?')
      let params = arr[1].split('&')
      const keyArr = params[0].split('=')
      const key = keyArr[0]
      const staffId = keyArr[1]
      const type = params[1].split('=')[1]
      app.globalData.params = {
        staffId,
        type
      }
    }else{
      wx.showModal({
        title: '系统提示',
        content: '请扫二维码进入',
      })
    }

    // 测试
    // app.globalData.params = {
    //   staffId: 13,
    //   type: '2'
    // }

    const that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          app.getAuthKey().then(res => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          })
        }
      },
      fail: function (res) {
        console.log(res)
        that.isSet = false
      }
    })
  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function(userInfo) {
          app.getAuthKey(userInfo).then(res => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          })
        }
      });
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  },
})