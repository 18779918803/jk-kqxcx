const app = getApp();
var api = require("../../utils/api");
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: {
      date: '',
      typeId:'',
    },
    records:[],
  },

  // 搜索日期改变
  bindDateChange: function(e) {
    this.setData({
      ['search.date']: e.detail.value,
    }),
    app.globalData.search.date = e.detail.value,
    this.getRecords();
  },
  //筛选按钮点击
  toSelectSearchType: function() {
    wx.navigateTo({
      url: '/pages/works/check/select-search-type/select-search-type',
    })
  },

  //列表查询接口，onshow中调用
  getRecords: function(){
    var search = app.globalData.search;
    console.log("调用getRecors");
    console.log(search)
    var that = this;
    wx.showLoading({
      title: '获取记录中',
      mask: true
    });
    wx.request({
      url: api.finishUrl, //请求路径
      method: 'GET',
      data: {
        date: search.date,
        typeId: search.typePId,
        organId: search.organId,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          console.log(res.data);
          if (res.data.code == 200) {
            that.setData({
              records: res.data.data,
            })
            wx.hideLoading();
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 搜索日期给初值
   */
  onShow: function () {
    var that = this;
    var date = app.globalData.search.date;
    console.log(date)
    if(date == '' || date == null){
      console.log('获取当前时间日期');
      var date = util.formatDate(new Date());
      // console.log(a);
      // date = app.dateToString(new Date());
      app.globalData.search.date = date;
    }
    that.setData({
      ['search.date']: date,
    });

    if (app.globalData.search.typePId == '') {
      console.log('初始化搜索类型');
      app.globalData.search.typePId = 0;
      that.setData({
        ['search.typeId']: 0,
      });
    }

    that.getRecords();
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