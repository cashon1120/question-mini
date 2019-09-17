// pages/default/index.js
import http from '../../utils/http.js'
const app = getApp()
import {
  hasObj
} from '../../utils/util.js'
Page({
  data: {
    showSuccess: false, // 提交结果
    questionArr: [],
    userAnswer: [], // 答题结果
    userAnswered: 0, // 已答题数量
    timeLeft: 60, // 答题时间(单位: 分)
    formatLeftTime: '',
    timesUp: false, // 是否结束
    loading: false, // 加载
    currentIndex: 0,
    readyToSubmit: false,
    canTest: false
  },
  onLoad: function () {
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
        this.handleSubmit()
      }
    }, 1000);
  },

  // 上一题
  preQuestion: function () {
    let {
      currentIndex
    } = this.data
    currentIndex = Math.max(0, currentIndex - 1)
    this.setData({
      currentIndex
    })
  },

  // 下一题
  nextQuestion: function () {
    let {
      questionArr,
      currentIndex
    } = this.data
    currentIndex = Math.min(questionArr.length - 1, currentIndex + 1)
    this.setData({
      currentIndex
    })
  },

  // 获取题目
  getQuestion: function () {
    const candidateId = app.globalData.userInfo.id
    const staffId = app.globalData.params.staffId
    http('/app/applets/exam', 'POST', {
      candidateId,
      staffId
    }).then(res => {
        res.data.forEach(item => {
          const question = item.optionArray
          for (let i = 0; i < question.length; i += 1) {
            const str = question[i].split('->')
            question[i] = {
              id: str[0],
              value: str[1],
              selected: false
            }
          }
          item.optionArray = question
        })
        this.setData({
          questionArr: res.data,
          canTest: true
        })
        // 开始倒计时
        this.setLeftTime()
    }).catch(res => {
      if(!res.success){
        app.globalData.resultType = 3
        wx.redirectTo({
          url: "/pages/result/index",
        })
      }
    })
  },

  // 选择答案
  selectAnswers: function (e) {
    const {
      questionArr,
      currentIndex
    } = this.data
    const id = e.target.dataset.id
    const {
      is_multiple_selection
    } = questionArr[currentIndex].question
    questionArr[currentIndex].optionArray.forEach(item => {
      // 单选/多选判断
      if (is_multiple_selection === 1) {
        if (item.id === id) {
          if (!item.selected) {
            item.selected = true
          } else {
            item.selected = false
          }
        }
      } else {
        if (item.id === id) {
          item.selected = true
        } else {
          item.selected = false
        }
      }
    })
    this.setData({
      questionArr
    })
  },


  // 准备提交
  handleToSubmit: function () {
    const {
      questionArr,
      timesUp
    } = this.data
    if (timesUp) {
      wx.showToast({
        icon: 'none',
        title: '考试时间已结束, 不能答题!'
      })
      return
    }
    let examVoList = []
    let noAnswers = []
    questionArr.forEach((item, index) => {
      let selected = []
      item.optionArray.forEach(option => {
        if (option.selected) {
          selected.push(option.id)
        }
      })
      if (selected.length === 0) {
        noAnswers.push(index + 1)
      }
    })

    if (noAnswers.length > 0) {
      wx.showToast({
        icon: 'none',
        title: `还有${noAnswers.length}道题目没答:(${noAnswers.join(',')})`
      })
      return
    }

    const {
      readyToSubmit
    } = this.data
    this.setData({
      readyToSubmit: !readyToSubmit
    })
  },

  // 上传数据
  handleSubmit: function () {
    this.setData({
      loading: true
    })
    const {
      questionArr
    } = this.data
    let examVoList = []
    questionArr.forEach(item => {
      let selected = []
      item.optionArray.forEach(option => {
        if (option.selected) {
          selected.push(option.id)
        }
      })
      examVoList.push({
        isMultipleSelection: item.question.is_multiple_selection,
        questionId: item.question.id,
        optionId: selected.join(','),
        score: 0
      })
    })
    const jsonString = JSON.stringify({
      examVoList,
      score: 0,
      sysUserId: app.globalData.params.staffId,
      candidateId: app.globalData.userInfo.id
    })
    http('/app/applets/finishUpJob', 'POST', {
      jsonString: jsonString
    }).then(() => {
      app.globalData.resultType = 1
      wx.navigateTo({
        url: "/pages/result/index",
      })
    })
  }
})