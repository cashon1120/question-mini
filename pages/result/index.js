// pages/result/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    tips: '',
    btnText: '',
    success: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const resultType = app.globalData.resultType
    if (resultType === 1) {
      this.setData({
        title: '考试结束',
        tips: '请等待考试结果',
        btnText: '',
        showBtn: false
      })
    } else if (resultType === 2) {
      this.setData({
        title: '等待审核',
        tips: '',
        btnText: '返回',
        showBtn: true
      })
    } else if (resultType == 3){
      this.setData({
        title: '等待审核',
        tips: '个人资料审核未通过，无法参加考试',
        btnText: '',
        showBtn: false,
        success: false
      })
    }else{
      this.setData({
        title: '禁止访问',
        tips: '请通过扫描二维码进入系统',
        btnText: '',
        showBtn: false,
        success: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  handleSubmit: function() {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})