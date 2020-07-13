// pages/overtime/overtime.js
const app = getApp();
Page({
  mixins: [require('../../../../dist/mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    travelTypes: [],
    currentWork : {},
    startDate: '',
    endDate: '',
    typeId: '',
    type: '',
    day: '',
    reason: '',
    reasonLength: 0,
  },
  bindstartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindendDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindTypeChange: function(e) {
    this.setData({
      typeId: this.data.travelTypes[e.detail.value].id,
      type: this.data.travelTypes[e.detail.value].name,
    })
  },
  bindDayChange: function(e) {
    this.setData({
      day: e.detail.value,
    });
  },
  bindReasonChange: function(e) {
    var len = e.detail.value.length;
    this.setData({
      reason: e.detail.value,
      reasonLength: len,
    })
  },
  submitApp: function() {
    wx.request({
      url: app.globalData.url.subTravelApp, //请求路径
      data: {
        startDate: this.data.startDate,
        endDate:this.data.endDate,
        typeId: this.data.typeId,
        day: this.data.day,
        reason: this.data.reason,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            wx.navigateTo({
              url: '/pages/works/travel-record-list/travel-record-list',
            })
          }else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 1000
            })
          }
        }
      },
      fail () {
        console.log('程序出错了')
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化的时候，日期默认是今天
    this.setData({
      startDate: app.dateToString(new Date()),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //请求核销的所有类型
    wx.request({
      url: app.globalData.url.travelType, //请求路径
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            that.setData({
              travelTypes: res.data.data,
            })
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})