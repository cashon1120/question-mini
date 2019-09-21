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
    timeLeft: 0, // 答题时间(单位: 分)
    formatLeftTime: '',
    timesUp: false, // 是否结束
    loading: false, // 加载
    currentIndex: 0,
    readyToSubmit: false,
    canTest: false,
    firstSubmit: false,
    noCheckedQuestion: []
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
        res.data.questionsAndAnswerList.forEach(item => {
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
          timeLeft: res.data.answerTime,
          questionArr: res.data.questionsAndAnswerList,
          canTest: true
        })
        // 开始倒计时
        this.setLeftTime()
    }).catch(res => {
      if(!res.success){
        app.setResultParams({
          title: '操作失败',
          tips: res.msg,
          btnText: '返回',
          showBtn: false,
          success: false,
          redirect: true
        })
      }
    })
  },

  // 选择答案
  selectAnswers: function (e) {
    const {
      questionArr,
      currentIndex,
      noCheckedQuestion
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
    if(noCheckedQuestion.length > 0){
      noCheckedQuestion.forEach((item, index) => {
        if(item - 1 === currentIndex){
          noCheckedQuestion.splice(index, 1)
        }
      })
    }
    this.setData({
      questionArr,
      noCheckedQuestion
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
      this.setData({
        firstSubmit: true,
        noCheckedQuestion: noAnswers
      })
      return
    }
    this.setData({
      firstSubmit: false,
    })
    const {
      readyToSubmit
    } = this.data
    this.setData({
      readyToSubmit: !readyToSubmit
    })
  },

  showQuestion: function(e){
    const {index} = e.target.dataset
    this.setData({
      currentIndex: parseInt(index) - 1
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
      app.setResultParams({
        title: '考试结束',
        tips: '请等待考试结果',
        showBtn: false,
        success: true,
        redirect: true
      })
    })
  }
})