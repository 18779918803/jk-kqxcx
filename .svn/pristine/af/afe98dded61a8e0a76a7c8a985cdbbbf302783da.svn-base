// pages/sw/instructionList/info/info.js
const app = getApp();

var api = require("../../../../utils/sw_api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    currentRecord: '',
    info : '',
    rootPath: api.rootPath,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      currentRecord : app.globalData.currentRecord,
      id: options.id,
    });
    console.log(options);
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
    this.getSeeInfo();
  },

  //获取审批收文内容
  getSeeInfo: function(){
    var that = this;
    //请求审批收文详情信息
    wx.request({
      url: api.seeInfo, //请求路径
      method: 'GET',
      data: {
        id: this.data.id,     
      },
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            console.log(res.data);
            that.setData({
              info:res.data.data,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            });
            console.log(res);
          }
        }
      }
    });
  },

  //打开文件
  preview: function () {
    app.showToast('文件加载中..');
    if(this.data.info.editable == 1){
      wx.navigateTo({
        url: '/pages/sw/seeList/editor/editor?id='+ this.data.id,
      })
    }else{
      this.swDownloadFile();
    }

  },

  swDownloadFile: function(){
    var that = this;
    
    wx.downloadFile({
      url: api.TestPath + this.data.info.url,
      success: function (res) {
        var filePath = res.tempFilePath
        console.log(filePath)

        wx.openDocument({
          filePath: filePath,
          fileType: that.data.type,
          success: function (res) {
            console.log("打开文档成功")
            console.log(res);
          },
          fail: function (res) {
            console.log("fail");
            app.showToast('文件显示失败');
            console.log(res)
          },
          complete: function (res) {
            console.log("complete");
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log('fail')
        app.showToast('文件下载失败');
        console.log(res)
      },
      complete: function (res) {
        console.log('complete')
        console.log(res)
      }
    })
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