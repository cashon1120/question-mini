const API_BASE_URL = 'https://app.eastshow.cn/'
// const API_BASE_URL = 'http://hsdmha.cross.echosite.cn/'

const http = function (url, method, data, title = '加载中...') {
  const app = getApp()
  wx.showLoading({
    title,
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      header: app.globalData.header,
      method,
      data,
      success: function (res) {
        wx.hideLoading()
        if (res.data.code !== 0) {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        reject(res.data)
        wx.hideLoading()
        wx.showToast({
          title: '请求失败啦!',
          icon:'none'
        })
      }
    });
  });
};

export default http