//index.js
import WxValidate from '../../utils/WxValidate.js'
import http from '../../utils/http.js'
const app = getApp()

Page({
  data: {
    formData: {
      name: '',
      sex: '',
      birth_time: '',
      graduation_time: '',
      education: '',
      profession_category: '',
      schoolType: '',
      undergraduate_school_category: '',
      is_specialized: '',
      english_level: ''
    }, // 表单数据
    loading: false, // 加载
    educationArr: ['博士研究生', '硕士研究生', '大学本科', '大学专科'],
    majorArr: ['电工类', '电子信息类', '其它工学类', '大学金融财务类', '管理类', '其他'],
    majorIndex: '',
    schoolTypeIndex: '',
    educationIndex: '',
    undergraduateSchoolCategoryIndex: '',
    schoolTypeArr: ['985工程院校', '211工程院校', '电力部属院校', '一般本科院校', '独立学院', '国(境)外院校', '其他'],
    computerLevelArr: [{
      id: 1,
      value: '一级'
    }, {
      id: 2,
      value: '二级'
    }, {
      id: 3,
      value: '三级'
    }, {
      id: 4,
      value: '四级'
    }],
    companyArr: [{
        name: '四川省公司',
        value: '1'
      },
      {
        name: '乐山公司',
        value: '2'
      },
      {
        name: '绵阳公司',
        value: '3'
      },
      {
        name: '内江公司',
        value: '4'
      },
      {
        name: '成功公司',
        value: '5'
      }
    ], // 公司列表
    showModal: false, // 显示投递公司模态框
    showSuccess: false, // 显示成功界面
    canEdit: false, // 是否可编辑
    selectedCompany: [], // 已先公司列表
    hasUserInfo: false,
    oldData: {}
  },

  onLoad: function () {
    this.initValidate()
    if (app.globalData.userInfo.id) {
      this.setData({
        hasUserInfo: true,
        canEdit: false,
        formData: app.globalData.userInfo,
        oldData: JSON.parse(JSON.stringify(app.globalData.userInfo))
      }, () => {
        console.log(this.data.hasUserInfo)
      })
    }
  },
  // 初始化表单验证
  initValidate() {
    const rules = {
      name: {
        required: true,
        maxlength: 11
      },
      sex: {
        required: true
      },
      // birth_time: {
      //   required: true
      // },
      // graduation_time: {
      //   required: true
      // },
      // education: {
      //   required: true
      // },
      // profession_name: {
      //   required: true
      // },
      // profession_category: {
      //   required: true
      // },
      // graduated_school: {
      //   required: true
      // },
      // school_category: {
      //   required: true
      // },
      // address: {
      //   required: true
      // },
      // is_specialized: {
      //   required: true
      // },
      // english_level: {
      //   required: true
      // },
      // computer_level: {
      //   required: true
      // },
    }
    const messages = {
      name: {
        required: '请输入姓名',
      },
      sex: {
        required: '请选择性别'
      },
      birth_time: {
        required: '请选择出生年月'
      },

      graduation_time: {
        required: '请选择毕业时间'
      },
      education: {
        required: '请输入学历'
      },
      profession_name: {
        required: '请输入专业名称'
      },
      profession_category: {
        required: '请选择院校类别'
      },
      graduated_school: {
        required: '请输入毕业院校'
      },
      school_category: {
        required: '请选择学校类型'
      },
      address: {
        required: '请输入生源地'
      },
      is_specialized: {
        required: '请选择是否专升本'
      },
      english_level: {
        required: '请选择英语等级'
      },
      computer_level: {
        required: '请输入计算机等级'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 输入框事件
  bingInputChange: function (e) {
    const {
      key
    } = e.target.dataset
    const {
      formData
    } = this.data
    formData[key] = e.detail.value
    this.setData({
      formData
    })
  },

  //  普通选择事件
  bindPickerChange: function (e) {
    const {
      key
    } = e.target.dataset
    const index = e.detail.value
    const {
      formData,
      educationArr,
      majorArr,
      schoolTypeArr,
      computerLevelArr
    } = this.data
    switch (key) {
      case 'education':
        formData[key] = educationArr[index]
        break;
      case 'profession_category':
        formData[key] = majorArr[index]
        break;
      case 'school_category':
        formData[key] = schoolTypeArr[index]
        break;
      case 'undergraduate_school_category':
        formData[key] = schoolTypeArr[index]
        break;
      case 'computer_level':
        formData[key] = computerLevelArr[index].value
        break;
      default:
        break;
    }
    this.setData({
      formData
    })

  },

  // 切换编辑状态
  handleEditStatus: function () {
    const {
      canEdit,
      oldData
    } = this.data
    this.setData({
      canEdit: !canEdit
    }, () => {
      if (!this.data.canEdit) {
        this.setData({
          formData: JSON.parse(JSON.stringify(oldData))
        })
      }
    })
  },

  // 提交表单
  formSubmit: function (e) {
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        icon: 'none',
        title: error.msg
      })
      return false
    }
    if (params.computer_level) {
      switch (params.computer_level) {
        case '一级':
          params.computer_level = 1
          break;
        case '二级':
          params.computer_level = 2
          break;
        case '三级':
          params.computer_level = 3
          break;
        case '四级':
          params.computer_level = 4
          break;
      }
    }
    const data = {
      candidate: {
        ...params,
        open_id: app.globalData.open_id,
        id: app.globalData.userInfo.id || 0,
      },
      staffId: 8
    }

    // 验证通过后显示选择公司模态框, 看是否要先提交个人信息再显示还是选完公司后一起提交
    // this.setData({
    //   loading: true
    // })
    // this.handleSetShowModal()
    http('/app/applets/addAndGetList', 'POST', data).then(res => {
      this.setData({
        companyArr: res.data
      })
      // 获取用户信息
      if (!app.globalData.userInfo.id) {
        http('/app/applets/findCandidateByOpenId', 'POST', {
          open_id: app.globalData.open_id
        }).then(res => {
          this.setData({
            loading: false
          })
          app.globalData.userInfo.id = res.data.id
          this.handleSetShowModal()
        })
      } else {
        this.handleSetShowModal()
      }

    }).catch(() => {
      this.setData({
        loading: false
      })
    })
  },

  // 显示投递弹窗
  handleSetShowModal: function () {
    const {
      showModal
    } = this.data
    this.setData({
      showModal: !showModal
    })
  },

  // 投递公司
  handleSubmitSelectCompany: function () {
    const {
      userId
    } = this.data
    this.setData({
      loading: true
    })
    http('/app/applets/getAllDeliveryState', 'POST', {
      candidateId: app.globalData.userInfo.id
    }).then(res => {
      if (res.success) {
        this.handleSetShowModal()
        this.handleSetSuccss()
      }
      this.setData({
        loading: false
      })
    })
  },

  // 投递成功
  handleSetSuccss: function () {
    app.globalData.resultType = 2
    wx.navigateTo({
      url: "/pages/result/index",
    })
  }

})