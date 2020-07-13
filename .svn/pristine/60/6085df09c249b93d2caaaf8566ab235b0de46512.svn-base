const app = getApp();
Page({
  mixins: [require('../../../dist/mixin/themeChanged')],
  data: {
    userInfo: {},
    userPosition: {},
    currentWork : {},
    search: {
      year: '',
      month: '',
    },
    monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
    positionList:[],
    //记录状态：-1为已拒绝，0为原始状态，1为已通过
    travelRecordList: [],
  },
  // 年份搜索改变
  bindYearChange: function(e) {
    var year = 'search.year';
    this.setData({
      [year]: e.detail.value,
    });
    this.getTravelRecordList();
  },
  // 月份搜索改变
  bindMonthChange: function(e) {
    var month = 'search.month';
    this.setData({
      [month]: this.data.monthList[e.detail.value],
    });
    this.getTravelRecordList();
  },
  // 跳转到新增申请页面
  travelApplication: function(){
    wx.navigateTo({
      url: '/pages/works/travel-record-list/travel-application/travel-application',
    })
  },
  // 申请详情页面
  travelRecordDetail: function(obj) {
    var index = obj.currentTarget.dataset.message;
    app.globalData.currentRecord = this.data.travelRecordList[index];
    wx.navigateTo({
      url: '/pages/works/travel-record-list/travel-record-detail/travel-record-detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      userPosition: app.globalData.userPosition,
    });
    //页面初始化的时候加载日期数据
    this.loadDateData();
  },
  //页面初始化的时候加载日期数据
  loadDateData: function() {
    var date = new Date();
    var year = 'search.year';
    var month = 'search.month';
    this.setData({
      [year]: date.getFullYear(),
      [month]: date.getMonth() + 1,
    })
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
    this.getTravelRecordList();
    this.getPositionList();
  },
  //获取所有的加班记录
  getTravelRecordList: function(){
    var that = this;
    //请求当月的加班记录
    wx.request({
      url: app.globalData.url.travelList, //请求路径
      method: 'GET',
      data: {
        date: that.data.search.year+'-'+that.data.search.month+'-'+1,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            that.setData({
              travelRecordList: res.data.data,
            })
          }
        }
      }
    });
  },
  getPositionList:function(){
    var that = this;
    //请求所有的职位信息
    wx.request({
      url: app.globalData.url.positionList, //请求路径
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            that.setData({
              positionList: res.data.data,
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