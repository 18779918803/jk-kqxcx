const app = getApp();
var api = require("../../../utils/api");
var util = require("../../../utils/util");
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
      // url: '/pages/works/check/select-search-type/select-search-type',
    })
  },

  
   // 申请详情页面
   loanRecordDetail: function(obj) {
    var index = obj.currentTarget.dataset.message;
    console.log(obj,"---------");
    app.globalData.currentRecord = this.data.records[index];
  
    wx.navigateTo({
      url: '/pages/loan/detail/detail',
    })
  },

  //列表查询接口，onshow中调用
  getRecords: function(){
    var search = app.globalData.search;
    console.log("调用getRecors");
    console.log(search)
    var that = this;
    //请求已审核的记录，默认查询请假
    wx.request({
      url: app.globalData.url.loanDoneList, //请求路径
      method: 'GET',
      data: {
          name:app.globalData.userInfo.name,
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success (res) {
        if (res.statusCode == 200) {
          console.log(res.data);
          if (res.data.code == 200) {
            that.setData({
              records: res.data.data,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            });
            console.log("finish.js getRecords() error res:----->>>>");
            console.log(res);
          }
        }
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

    if (that.data.search.typeId == '') {
      console.log('初始化搜索类型');
      app.globalData.search.typePId = 2;
      that.setData({
        ['search.typeId']: 2,
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