const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentWork: {},
    currentRecord: {},
    checkList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      userInfo: app.globalData.userInfo,
      id: options.id,
      pid: options.pid,
    });
    this.getDetail();
  },

  getDetail() {
    var that = this;
    // 读取数据
    wx.showLoading({
      title: '获取记录中',
      mask: true
    });
    wx.request({
      url: app.globalData.url.apply.detail, //请求路径
      method: 'GET',
      data: {
        id: this.data.id,
        pid: this.data.pid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            that.setData({
              record: res.data.data,
            });
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