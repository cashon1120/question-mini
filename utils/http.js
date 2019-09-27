const API_BASE_URL = 'https://juneee.cn'
// const API_BASE_URL = 'http://hsdmha.cross.echosite.cn/'

function JSON_to_URLEncoded(element, key, list) {
  var list = list || [];
  if (typeof (element) == 'object') {
    for (var idx in element)
      if (element[idx] || element[idx]=== 0) {
        JSON_to_URLEncoded(element[idx], key ? key + '.' + idx : idx, list);
      }
  } else {
    list.push(key + '=' + encodeURIComponent(element));
  }
  return list.join('&');
}

const http = function (url, method, data, title = '加载中...') {
  const app = getApp()
  wx.showLoading({
    title
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method,
      data: JSON_to_URLEncoded(data),
      success: function (res) {
        wx.hideLoading()
        if (!res.data.success) {
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        reject(res)
        wx.hideLoading()
        wx.showToast({
          title: '请求失败啦!',
          icon: 'none'
        })
      }
    });
  });
};

export default http