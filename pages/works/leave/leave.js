const app = getApp();
var utils = require("../../../utils/util")
var api = require("../../../utils/api")
Page({
  data: {
    userInfo: {},
    userPosition: {},
    currentWork : {},
    date:'',
    search: {
      year: '',
      month: '',
    },
    monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
    positionList:[],
    //记录状态：-1为已拒绝，0为原始状态，1为已通过
    leaveRecordList: [],
  },
  
  bindDateChange: function (e) {
    var date = e.detail.value;
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    this.setData({
      date: date,
      year: year,
      month: month
    });
    this.loadData(e.detail.value);
  },

  // 申请详情页面
  detail: function (obj) {
    console.log(obj.currentTarget.dataset);
    var id = obj.currentTarget.dataset.id;
    var pid = obj.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/works/leave/detail/detail?id=' + id + '&pid=' + pid,
    })
  },

  onLoad: function (options) {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //
    var headerHeight = 65;
    var res = wx.getSystemInfoSync();
    var scrollViewHeight = res.windowHeight - headerHeight;
    this.setData({
      date: year + "-" + month,
      year: year,
      month: month,
      start: "2020-07",
      end: year + "-" + month,
      scrollViewHeight: scrollViewHeight,
      scrollViewTop: headerHeight
    });
    //
    this.loadData(this.data.date);
  },
  
  loadData: function (date) {
    const page = this;
    // 读取数据
    wx.showLoading({
      title: '获取记录中',
      mask: true
    });
    wx.request({
      url: app.globalData.url.leave.list,
      method: 'POST',
      data: {
        date: date
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        thirdSession: app.globalData.thirdSession
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            page.setData({
              record: res.data.data
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
    })
  },
})