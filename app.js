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
          http('/app/applets/findCandidateByOpenId', 'POST', {
            open_id: self.globalData.open_id
          }).then(res => {
            if (res.data) {
              if (res.data.computer_level) {
                switch (res.data.computer_level) {
                  case 1:
                    res.data.computer_level = '一级'
                    break;
                  case 2:
                    res.data.computer_level = '二级'
                    break;
                  case 3:
                    res.data.computer_level = '三级'
                    break;
                  case 4:
                    res.data.computer_level = '四级'
                    break;
                }
              }
              for(let key in res.data){
                if(typeof(res.data[key]) === 'number'){
                  res.data[key] = res.data[key].toString()
                }
              }
              self.globalData.userInfo = res.data
            }
            // 根据参数跳转不同的页面
            wx.navigateTo({
              // url: "/pages/index/index",
              url: "/pages/examination/index",
            })
          })
        }
      })
    })
  },

  globalData: {
    resultType: 2,
    open_id: '12345678123231a234234qwerqr2',
    userInfo: {
      id: ''
    },
    code: '', // 微信登录code 
  },
})