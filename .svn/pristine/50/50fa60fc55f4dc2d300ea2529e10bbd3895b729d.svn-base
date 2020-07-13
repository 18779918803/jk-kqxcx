const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentWork : {},
    currentRecord: {},
    history:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      history : app.globalData.currentRecord,
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
    this.getcurrentRecordDetail();
  },

  getcurrentRecordDetail(){
    var that = this;
    //请求当月的加班记录
    wx.request({
      url: app.globalData.url.loanCheckDetial, //请求路径
      method: 'GET',
      data: {
        id: this.data.history.id,     
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            console.log(res.data);
            var his = res.data.data.his;
            console.log(res.data.data.his)
            for(let i=0;i<his.length;i++) {
              if (his[i].comment.indexOf('拒绝') >= 0) {
                his[i].isPass=false;
              } else {
                his[i].isPass=true;
              }
            }
            console.log(res.data);
            that.setData({
              currentRecord:res.data.data,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            });
            console.log(res);
           console.log("leave-record-detail getcurrentRecordDetail()提交失败");
          }
        }
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