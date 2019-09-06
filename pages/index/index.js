//index.js
import WxValidate from '../../utils/WxValidate.js'
import http from '../../utils/http.js'
const app = getApp()

Page({
  data: {
    formData: {
      name: '张三',
      sex: '0',
      birthday: '2018-06-07',
      graduateTime: '',
      education: '',
      major: '',
      schoolType: '',
      schoolType1: '',
    },
    loading: false,
    educationArr: ['博士研究生', '硕士研究生', '大学本科', '大学专科'],
    majorArr: ['电工类', '电子信息类', '其它工学类', '大学金融财务类', '管理类', '其他'],
    schoolTypeArr: ['985工程院校', '211工程院校', '电力部属院校', '一般本科院校', '独立学院', '国(境)外院校', '其他'],
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
    ],
    showModal: false,
    showSuccess: false,
    canEdit: false,
    selectedCompany: []
  },

  onLoad: function () {
    this.initValidate()
  },
  initValidate() {
    const rules = {
      name: {
        required: true,
        maxlength: 11
      },
      sex: {
        required: true
      },
      birthday: {
        required: true
      }
    }
    const messages = {
      name: {
        required: '请输入姓名',
      },
      sex: {
        required: '请选择性别'
      },
      birthday: {
        required: '请选择出生年月'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 选择日期事件
  bindDateChange: function (e) {
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
      schoolTypeArr

    } = this.data

    switch (key) {
      case 'education':
        formData[key] = educationArr[index]
        break;
      case 'major':
        formData[key] = majorArr[index]
        break;
      case 'schoolType':
        formData[key] = schoolTypeArr[index]
        break;
      case 'schoolType1':
        formData[key] = schoolTypeArr[index]
        break;

      default:
        break;
    }

    this.setData({
      formData
    })

  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  handleEditStatus: function(){
    const {canEdit} = this.data
    this.setData({
      canEdit: !canEdit
    })
  },

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
    const data = {
      ...params,
      code: app.globalData.code
    }

    this.handleSetShowModal()
    // http('user/additionalMaterials', 'POST', data).then(res => {
    //   app.globalData.userInfo = res.data
    //   app.globalData.header.authorization = `YTX_STORE;${res.data.token}`
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    //   wx.showToast({
    //     title: '绑定成功'
    //   })
    // })
  },

  // 显示投递弹窗
  handleSetShowModal: function(){
    const {showModal} = this.data
    this.setData({
      showModal: !showModal
    })
  },

  // 选择投递公司
  checkboxChange: function(e){
    const values = e.detail.value
    this.setData({
      selectedCompany: values
    })
  },

  // 投递公司
  handleSubmitSelectCompany:function(){
    const {selectedCompany} = this.data
    if(selectedCompany.length === 0){
      wx.showToast({
        icon: 'none',
        title: '选择要投递的公司'
      })
      return false
    }
    this.setData({
      loading: true
    })
    this.handleSetShowModal()
    this.handleSetSuccss()
  },

  handleSetSuccss:function(){
    const { showSuccess} = this.data
    this.setData({
      showSuccess: !showSuccess
    })
  }
})