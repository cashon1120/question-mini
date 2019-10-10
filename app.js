//app.js
import http from './utils/http.js'
App({

  stopScroll() {},

  // 登录
  getAuthKey: function () {
    const self = this
    return new Promise(function (resolve, reject) {
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

  getUserInfo(firstEnter) {
    const self = this
    self.globalData.params.staffId = self.globalData.enterByScanCode ? self.globalData.params.staffId : 21
    const apiUrl = self.globalData.params.type === '1' ? 'findCandidateByOpenId' : 'findCandidateByOpenIdKs'
    http('/app/applets/' + apiUrl, 'POST', {
      open_id: self.globalData.open_id,
      staffId: self.globalData.params.staffId
    }).then(res => {
      // 是否有用户信息
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
          if (typeof (res.data[key]) === 'number') {
            res.data[key] = res.data[key].toString()
          }
        }
        self.globalData.userInfo = res.data.candidate
        // 是否有投递记录
        if (Array.isArray(res.data.sysUserList)) {
          self.globalData.company = res.data.sysUserList
        }
        // 当前投递公司Id
        self.globalData.joinId = res.data.userId
      }

      // 不是扫码进入
      if (!self.globalData.enterByScanCode) {
        // 开关为1, 允许扫码进入
        if (self.globalData.allowEnterByNoCode === '1') {
          if (firstEnter) {
            wx.navigateTo({
              url: "/pages/index/index"
            })
          }
          return
        }
        // 开关为0, 禁止扫码进入
        wx.showToast({
          icon: 'none',
          title: '错误操作, 请扫码进入系统'
        })
      } else {
        // 扫码进入,首次加载需要跳转
        if (firstEnter) {
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
        }
      }
    }).catch(res => {
      self.globalData.enterError = res.msg || '出错啦'
      if (self.globalData.params.type === '1') {
        wx.navigateTo({
          url: "/pages/index/index"
        })

      }
      if (self.globalData.params.type === '2') {
        self.setResultParams({
          title: '错误提示',
          tips: res.msg || '出错啦',
          showBtn: false,
          success: false
        })
      }
    })
  },

  // 设置错误信息
  setResultParams(params) {
    const resultParams = {
      title: '系统提示',
      success: false,
      showBtn: true,
      redirect: false,
      ...params
    }
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

  getEnterType: function () {
    http('/app/applets/smJoin', 'POST').then(res => {
      // 设置可扫码进入状态
      this.globalData.allowEnterByNoCode = res.data.value
      this.getUserInfo(true)
    })
  },

  globalData: {
    joinId: 0,
    enterByScanCode: true,
    enterError: '',
    allowEnterByNoCode: '',
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