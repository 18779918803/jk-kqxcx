//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
    this.setData({
      scrollViewHeight: wx.getSystemInfoSync().windowHeight,
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo
    });
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
    this.setData({
      scrollViewHeight: wx.getSystemInfoSync().windowHeight,
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo
    });
    setTimeout(() => {
      this.onLoad();
    }, 1000);
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

  },

  selfInfo: function () {
    wx.navigateTo({
      url: 'info/info',
    })
  },

  getUserInfo: function (e) {
    // console.log(e)
    const page = this;
    if (e.detail.userInfo) {
      console.log(e.detail.userInfo);
      page.setData({
        loading: true
      })
      app.userInfoSetInSQL(e.detail.userInfo, function () {
        console.log('callback');
        page.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: app.globalData.hasUserInfo
        });
        if (page.data.userInfo.name == null || page.data.userInfo.name == '' ||
          page.data.userInfo.organ == null || page.data.userInfo.organ == ''
        ) {
          wx.navigateTo({
            url: 'info/info',
          })
        }
      });
    }
  }
})