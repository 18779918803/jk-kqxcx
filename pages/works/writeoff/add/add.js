// pages/overtime/overtime.js
const app = getApp();

var util = require("../../../../utils/util")
var api = require("../../../../utils/api")


Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    typeId: '',
    type: '',
    types: [
      {id: 1, name: "上班卡"},
      {id: 2, name: "下班卡"}
    ],
    reason: '',
    reasonLength: 0,
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTypeChange: function(e) {
    this.setData({
      typeId: this.data.types[e.detail.value].id,
      type: this.data.types[e.detail.value].name
    })
  },
  bindReasonChange: function(e) {
    var len = e.detail.value.length;
    this.setData({
      reason: e.detail.value,
      reasonLength: len,
    })
  },
  his: function () {
    wx.navigateTo({
      url: '/pages/works/writeoff/writeoff',
    })
  },
  submit: function() {
    if (this.data.date == '') {
      app.showToast('请选择核销日期');
      return;
    }
    if (this.data.typeId == '') {
      app.showToast('请选择核销类型');
      return;
    }
    if (this.data.reason == '') {
      app.showToast('请输入核销原因');
      return;
    }
    if (this.data.reasonLength > 100) {
      app.showToast('核销原因限制100个字符');
      return;
    }
    var page = this;
    wx.showLoading({
      title: '提交申请中',
      mask: true
    });
    wx.request({
      url: app.globalData.url.writeoff.add, //请求路径
      data: {
        date: this.data.date,
        type: this.data.typeId,
        reason: this.data.reason,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            app.showToast('提交成功', 'success', function (res) {
              setTimeout(function () {
                page.setData({
                  reason: '',
                  reasonLength: 0
                });
                page.his();
              }, 2000);
            });
          }else {
            app.showToast(res.data.msg + '\n' + '(错误码:' + res.data.code + ')');
          }
        } else {
          app.showToast('服务器繁忙，请稍后再试\n' + '(状态码:' + res.statusCode + ')'); 
        }
      },
      fail(res) {
        app.showToast('服务器繁忙，请稍后再试\n' + '(状态码:500)');
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.formatDate(new Date);
    this.setData({
      minDate: date,
      date: date,
    })
  },
})