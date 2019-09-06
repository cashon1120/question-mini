// pages/default/index.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isSet: true
  },
  onLoad: function() {
    const that = this
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          app.getAuthKey().then(res => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.isSet = false
      }
    })
  },

  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function (userInfo) {
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