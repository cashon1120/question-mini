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
          // 获取OpenId
          http('/app/applets/get_openid', 'POST', {
            code: res.code
          }).then(res => {
            //console.log(JSON.parse(res.data))
            self.globalData.open_id = JSON.parse(res.data).openid
            // 获取用户信息
            self.getEnterType()
          })
        }
      })
    })
  },

  // type 不为 1 的时候代表扫码进来, 需要跳转
  getUserInfo(type) {
    const self = this
    http('/app/applets/findCandidateByOpenId', 'POST', {
      open_id: self.globalData.open_id,
      staffId: self.globalData.params.staffId
    }).then(res => {
      if (res.data.candidate) {
        if (res.data.candidate.computer_level) {
          switch (res.data.candidate.computer_level) {
            case 1:
              res.data.candidate.computer_level = '一级'
              break;
            case 2:
              res.data.candidate.computer_level = '二级'
              break;
            case 3:
              res.data.candidate.computer_level = '三级'
              break;
            case 4:
              res.data.candidate.computer_level = '四级'
              break;
          }
        }
        for (let key in res.data) {
          if (typeof(res.data[key]) === 'number') {
            res.data[key] = res.data[key].toString()
          }
        }
        self.globalData.userInfo = res.data.candidate
        console.log(Array.isArray(res.data.sysUserList))
        if (Array.isArray(res.data.sysUserList)) {
          self.globalData.company = res.data.sysUserList
        }
        self.globalData.joinId = res.data.userId
      }

      if (self.globalData.enterByCode === '1' && !self.globalData.params.type) {
        self.globalData.params.staffId = 9999
        wx.navigateTo({
          url: "/pages/index/index"
        })
        return
      }

      // 扫码进入
      if (type !== 1) {
        // 根据参数跳转不同的页面
        if (self.globalData.params.type === '1') {
          wx.navigateTo({
            url: "/pages/index/index"
          })
        }
        if (self.globalData.params.type === '2') {
          wx.navigateTo({
            url: "/pages/examination/index",
          })
        }
        return
      }
    }).catch(res => {
      wx.showToast({
        icon: 'none',
        title: res.msg || '出错啦'
      })
    })
  },

  setResultParams(params) {
    const resultParams = {
      title: '系统提示',
      success: false,
      showBtn: true,
      redirect: false,
      ...params
    }
    console.log(resultParams)
    this.globalData.resultParams = resultParams
    if (resultParams.redirect) {
      wx.redirectTo({
        url: "/pages/result/index"
      })
    } else {
      wx.navigateTo({
        url: "/pages/result/index"
      })
    }
  },

  getEnterType: function() {
    http('/app/applets/smJoin', 'POST').then(res => {
      this.globalData.enterByCode = res.data.value
      this.getUserInfo()
    })
  },

  globalData: {
    enterByCode: '',
    params: {},
    resultType: 0,
    resultParams: {},
    open_id: '',
    userInfo: {
      id: ''
    },
    company: [],
    code: '', // 微信登录code 
  },
})