// pages/overtime/overtime.js
const app = getApp();
var utils = require("../../../../utils/util");

Page({
  mixins: [require('../../../../dist/mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    currentWork : {},
    startDate: '',
    endDate: '',
    typeId: '',
    type: '',
    types: [
      { id: 1, name: "事假" },
      { id: 2, name: "年假" }
    ],
    day: '',
    days: [],
    time: '',
    times: [
      {
        id: 1,
        time: '上午'
      },{
        id: 2,
        time: '下午'
      }
    ],
    timeText: '',
    reason: '',
    reasonLength: 0,
  },
  bindTypeChange: function (e) {
    this.setData({
      typeId: this.data.types[e.detail.value].id,
      type: this.data.types[e.detail.value].name,
    })
  },
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    });
    this.calcDay(this.data.startDate, this.data.endDate);
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    });
    this.calcDay(this.data.startDate, this.data.endDate);
  },
  bindDayChange: function(e) {
    this.setData({
      day: this.data.days[e.detail.value].day,
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      time: this.data.times[e.detail.value].id,
      timeText: this.data.times[e.detail.value].time,
    });
  },
  bindReasonChange: function(e) {
    var len = e.detail.value.length;
    this.setData({
      reason: e.detail.value,
      reasonLength: len,
    })
  },
  calcDay: function (startDate, endDate) {
    if( startDate != '' && endDate != '' ){
      var start_date = new Date(startDate.replace(/-/g, "/"));
      var end_date = new Date(endDate.replace(/-/g, "/"));
      var ms = end_date.getTime() - start_date.getTime();
      var day = parseInt(ms / (1000 * 60 * 60 * 24)) + 1;
      if( day == 1 ){
        this.setData({
          day: '',
          days: [{day: 0.5}, {day: 1}]
        });
      }else{
        this.setData({
          day: day,
          days: [{day: day}]
        });
      }
    }
  },
  his: function () {
    wx.navigateTo({
      url: '/pages/works/leave/leave',
    })
  },
  submit: function() {
    if (this.data.typeId == '') {
      app.showToast('请选择请假类型');
      return;
    }
    if (this.data.startDate == '') {
      app.showToast('请选择开始日期');
      return;
    }
    if (this.data.endDate == '') {
      app.showToast('请选择结束日期');
      return;
    }
    if (this.data.day == '') {
      app.showToast('请选择请假天数');
      return;
    }
    if (this.data.day <= 0) {
      app.showToast('请假天数不正确');
      return;
    }
    if (this.data.day == 0.5 && this.data.time == '') {
      app.showToast('请选择请假时间');
      return;
    }
    if (this.data.reason == '') {
      app.showToast('请输入请假原因');
      return;
    }
    if (this.data.reasonLength > 100) {
      app.showToast('请假原因限制100个字符');
      return;
    }
    var page = this;
    wx.showLoading({
      title: '提交申请中',
      mask: true
    });
    wx.request({
      url: app.globalData.url.leave.add, //请求路径
      data: {
        typeId: this.data.typeId,
        startDate: this.data.startDate,
        endDate:this.data.endDate,
        day: this.data.day,
        time: this.data.time,
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
      startDate: date,
      endDate: date
    });
    this.calcDay(this.data.startDate, this.data.endDate);
  },
})