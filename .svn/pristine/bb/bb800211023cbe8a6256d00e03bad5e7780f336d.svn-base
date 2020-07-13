const app = getApp();
var api = require("../../utils/sw_api");

Page({
  mixins: [require('../../dist/mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    resList:'',
  },
  //跳转到工作记录列表页面
  toWorkRecordList: function(obj){
    var url = obj.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  more: function() {
    wx.navigateTo({
      url: '/pages/xizi/xizi',
    })
  },

  toLoan:function(){
    wx.navigateTo({
      url: '/pages/loan/loan',
    })
  },
  toDoneLoan:function(){
    wx.navigateTo({
      url: '/pages/loan/finish/finish',
    })
  },

  //请求工作页面资源
  getRecList: function(){
    var that = this;
    wx.request({
      url: api.worksRecList, //请求路径
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        console.log(res);
        that.setData({
          resList: res.data.data,
        });
      },
      error: function(res) {
        app.showToast('服务器繁忙，请稍后再试\n' + '(状态码:500)');  
      },  
      complete: function() {}  
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
   */
  onShow: function () {
    var that = this;
    app.userLogin(function () {
      that.setData({
        hasUserInfo: app.globalData.hasUserInfo
      });
      if ( app.globalData.hasUserInfo ){
        that.getRecList();
      }
    }, function(){
      app.showToast('请先登录');
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