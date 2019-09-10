// pages/default/index.js
import http from '../../utils/http.js'
const app = getApp()
import {
  hasObj
} from '../../utils/util.js'
Page({
  data: {
    showSuccess: false, // 提交结果
    // questionArr: [{
    //   title: '为加强电力生产现场管理，规范（），保证人身电网和设备安全，依据国家有关法律、法规，结合电力生产的实际，制定了安全管理规定。',
    //   id: 1,
    //   answers: [{
    //     id: 1,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 2,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 3,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 4,
    //     value: '各类工作人员的行为'
    //   }],
    //   checked: [],
    //   type: 0
    // }, {
    //   title: '这是一道多选题',
    //   id: 2,
    //   answers: [{
    //     id: 1,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 2,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 3,
    //     value: '各类工作人员的行为'
    //   }, {
    //     id: 4,
    //     value: '各类工作人员的行为'
    //   }],
    //   checked: [],
    //   type: 1
    // }], // 题目列表
    userAnswer: [], // 答题结果
    userAnswered: 0, // 已答题数量
    timeLeft: 60, // 答题时间(单位: 分)
    formatLeftTime: '',
    timesUp: false, // 是否结束
    loading: false, // 加载
    currentQuestion: {},
    currentIndex: 0
  },
  onLoad: function () {
    // this.setLeftTime()
    // this.setData({
    //   currentQuestion: this.data.questionArr[0]
    // })
    this.getQuestion()
  },

  // 倒计时计时器
  setLeftTime() {
    let {
      timeLeft
    } = this.data
    timeLeft = timeLeft * 60 * 1000
    let timer = setInterval(() => {
      timeLeft -= 1000
      const leftD = parseInt(timeLeft / (60 * 60 * 24 * 1000)) //转换为天
      const D = parseInt(timeLeft) - parseInt(leftD * 60 * 60 * 24 * 1000) //除去天的毫秒数
      const shengyuH = parseInt(D / (60 * 60 * 1000)) //除去天的毫秒数转换成小时
      const H = D - shengyuH * 60 * 60 * 1000 //除去天、小时的毫秒数
      const shengyuM = parseInt(H / (60 * 1000)) //除去天的毫秒数转换成分钟
      const M = H - shengyuM * 60 * 1000 //除去天、小时、分的毫秒数
      const leftM = shengyuM.toString().padStart(2, '0')
      const leftS = (M / 1000).toString().padStart(2, '0')

      // 格式化剩余时间
      this.setData({
        formatLeftTime: `${leftM}:${leftS}`
      })
      if (timeLeft === 0) {
        clearInterval(timer)
        wx.showToast({
          icon: 'none',
          title: '考试时间到,成绩自动提交'
        })
        this.setData({
          timesUp: true
        })
        // 倒计时结束后自动提交成绩
        this.uploadTest()
      }
    }, 1000);
  },

  // 选中答案
  selectChange: function (e) {
    const {
      id
    } = e.target.dataset
    const {
      value
    } = e.detail
    const {
      userAnswer,
      timesUp
    } = this.data
    if (timesUp) {
      wx.showToast({
        icon: 'none',
        title: '考试时间已结束, 不能答题!'
      })
      return
    }
    // hasObj 判断是否有当前答题数据, 有的话返回 对应索引: index
    const index = hasObj(userAnswer, id)
    if (index === false && index !== 0) {
      userAnswer.push({
        id,
        value
      })
    } else {
      userAnswer[index].value = value
    }
    this.setData({
      userAnswer
    }, () => {
      this.setUserAnswered()
    })
  },

  // 设置先答题结果
  setUserAnswered: function () {
    const {
      userAnswer
    } = this.data
    let userAnswered = 0
    userAnswer.forEach(item => {
      // 多选答案结果是数组, 加判断是否有答案
      if (typeof (item.value) === 'object') {
        if (item.value.length > 0) {
          userAnswered += 1
        }
      } else {
        if (item.value) {
          userAnswered += 1
        }
      }
    })
    this.setData({
      userAnswered
    })
  },

  // 提交答卷
  handleSubmit: function () {
    const {
      userAnswered,
      questionArr,
      timesUp,
    } = this.data
    if (timesUp) {
      wx.showToast({
        icon: 'none',
        title: '考试时间已结束, 不能答题!'
      })
      return
    }
    if (userAnswered < questionArr.length) {
      wx.showToast({
        icon: 'none',
        title: `还有 ${questionArr.length-userAnswered} 题未做, 请核对`
      })
      return
    }
    this.setData({
      loading: true
    })
    this.uploadTest()
  },

  // 上传数据
  uploadTest: function () {
    const {
      userAnswer
    } = this.data
    http('user/additionalMaterials', 'POST', data).then(res => {
      // 提交成功
      this.setData({
        showSuccess: true,
        loading: false
      })
    })
  },

  getQuestion:function(){
    const candidateId = app.globalData.userInfo.id
    const sysUserId = '2'
    http('/app/applets/exam', 'POST', {
      candidateId,
      sysUserId
    }).then(res => {
      console.log(res)
    })
  }
})