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
bindDateChange: function(e) {
    this.setData({
      ['search.date']: e.detail.value,
    }),
    app.globalData.search.date = e.detail.value,
    this.getRecords();
  },

  toSelectSearchType: function() {
    // wx.navigateTo({
    //   url: '/pages/dcdb/dcdbList/dcdbList',
    // })
  },


  //列表查询接口，onshow中调用
  getRecords: function(){
    var search = app.globalData.search;
    console.log("调用getRecors");
    console.log(search)
    var that = this;
    // date: search.date,
    //请求审核记录
    console.log(app.globalData.userInfo);
    wx.request({
      url: app.globalData.url.loanList, //请求路径
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
  pass: function(obj) {
    var id = obj.currentTarget.dataset.id;
    var that = this;
    console.log(id);
    //通过请求，插入审核记录
    wx.request({
      url: app.globalData.url.loanRecordPass, //请求路径
      method: 'POST',
      data: {
        id: id,
        name:app.globalData.userInfo.name,
      },
      header: {
        'content-type': 'application/json', // 默认值

      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '申请已通过',
              icon: 'success',
              duration: 1000
            })
            that.getRecords();
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            });
          }
        }
      }
    });
  },
  reject: function(obj) {
    var id = obj.currentTarget.dataset.id;
    var that = this;
    //拒绝请求，并插入审核记录
    wx.request({
      url: app.globalData.url.loanRecordReject, //请求路径
      method: 'POST',
      data: {
        id: id,
        name : app.globalData.userInfo.name
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '申请已拒绝',
              icon: 'none',
              duration: 1000
            })
            that.getRecords();
          }
        }
      }
    });
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
      app.globalData.search.typePId = 5;
      that.setData({
        ['search.typeId']: 5,
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