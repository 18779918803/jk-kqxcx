const app = getApp();
Page({
  data: {
    types: [
      {id: 5,name: '督办申请'},
      {id: 6,name: '督办延期(撤销)'},
      {id: 7,name: '督办办结申请'},
    ],
    search: {
      state: 0,
      typePId: 0,
      organId: 0,
    }
  },

  searchType: function(obj) {
    var id = obj.currentTarget.dataset.message;
    this.setData({
      ['search.typePId'] : id,
    });
    console.log(this.data.search)
  },
  searchOrgan: function(obj) {
    var id = obj.currentTarget.dataset.message;
    this.setData({
      ['search.organId'] : id,
    });
    console.log(this.data.search)
  },

  toSearch: function() {
    app.globalData.search.typePId = this.data.search.typePId;
    app.globalData.search.organId = this.data.search.organId;
    wx.navigateBack({
      complete: (res) => {},
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
    this.getOrgans();
  },

  getOrgans: function(){
    var that = this;
    wx.request({
      url: app.globalData.url.organList, //请求路径
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            console.log(res.data.data)
            that.setData({
              organs: that.data.organs.concat(res.data.data)
            })
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