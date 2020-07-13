// pages/overtime/overtime.js
const app = getApp();
var utils = require("../../../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    reason: '',
    reasonLength: 0
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
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
      url: '/pages/works/overtime/overtime',
    })
  },
  submit: function() {
    if( this.data.date == ''){
      app.showToast('请选择加班日期');
      return;
    }
    if (this.data.reason == '') {
      app.showToast('请输入加班事由');
      return;
    }
    if (this.data.reasonLength > 100) {
      app.showToast('加班事由限制100个字符');
      return;
    }
    var page = this;
    wx.showLoading({
      title: '提交申请中',
      mask: true
    });
    wx.request({
      url: app.globalData.url.overtime.add, //请求路径
      data: {
        date: this.data.date,
        reason: this.data.reason
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
          } else {
            app.showToast('服务器繁忙，请稍后再试\n' + '(错误码:' + res.data.code + ')');
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
  onLoad: function (options) {
    var date = utils.formatDate(new Date);
    this.setData({
      minDate: date,
      date: date
    })
  },
})