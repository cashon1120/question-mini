// pages/default/index.js
const app = getApp()
import {
  hasObj
} from '../../utils/util.js'
Page({
  data: {
    showSuccess: false,
    questionArr: [{
      title: '为加强电力生产现场管理，规范（），保证人身电网和设备安全，依据国家有关法律、法规，结合电力生产的实际，制定了安全管理规定。',
      id: 1,
      answers: [{
        id: 1,
        value: '各类工作人员的行为'
      }, {
        id: 2,
        value: '各类工作人员的行为'
      }, {
        id: 3,
        value: '各类工作人员的行为'
      }, {
        id: 4,
        value: '各类工作人员的行为'
      }],
      checked: [],
      type: 0
    }, {
      title: '这是一道多选题',
      id: 2,
      answers: [{
        id: 1,
        value: '各类工作人员的行为'
      }, {
        id: 2,
        value: '各类工作人员的行为'
      }, {
        id: 3,
        value: '各类工作人员的行为'
      }, {
        id: 4,
        value: '各类工作人员的行为'
      }],
      checked: [],
      type: 1
    }],
    userAnswer: [],
    userAnswered: 0,
    timeLeft: 1,
    formatLeftTime: '',
    timesUp: false
  },
  onLoad: function () {
    this.setLeftTime()
  },

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
        this.uploadTest()
      }
    }, 1000);
  },

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

  setUserAnswered: function () {
    const {
      userAnswer
    } = this.data
    let userAnswered = 0
    userAnswer.forEach(item => {
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
      questionArr
    } = this.data
    if (userAnswered < questionArr.length) {
      wx.showToast({
        icon: 'none',
        title: `还有 ${questionArr.length-userAnswered} 题未做, 请核对`
      })
      return
    }
    this.uploadTest()
  },

  // 上传数据
  uploadTest: function () {
    const {
      userAnswer
    } = this.data
    http('user/additionalMaterials', 'POST', data).then(res => {
      this.setData({
        showSuccess: true
      })
    })
  }
})