const app = getApp();
Page({
  data: {
    // states: [
    //   {id: 0, name: '审核中'},
    //   {id: 1,name: '审批通过'},
    //   {id: -1,name: '审批拒绝'},
    //   {id: 100,name: '全部'},
    // ],
    types: [
      {id: 0, name: '全部'},
      {id: 1,name: '加班申请'},
      {id: 2,name: '请假申请'},
      {id: 3,name: '核销申请'},
      {id: 4,name: '出差申请'}
    ],
    organs: [
      {id: 0,name: '全部'},
    ],
    search: {
      state: 0,
      typePId: 0,
      organId: 0,
    }
  },
  // searchState: function(obj) {
  //   var id = obj.currentTarget.dataset.message;
  //   this.setData({
  //     ['search.state'] : id,
  //   });
  //   console.log(this.data.search)
  // },
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
    // wx.navi({
    //   url: '/pages/works/check/check',
    // });
    wx.navigateBack({
      complete: (res) => {},
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("=====>>>>",options);
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