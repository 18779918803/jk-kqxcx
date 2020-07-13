const app = getApp();
var api = require("../../../utils/sw_api");
var util = require("../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    instructionList:'',

    start: 0,
    length: 10,
    currentPage: 0,
    total: 0,

    orderName: 'id',
    orderType: 'desc',

    receivedSn: '',
    receivedOrg: '',
    receivedOrgName: '',
    importance: '',
    importanceName: '',
    securityClassification: '',
    securityClassificationName: '',
    complete: '',
    completeName: '',
    title: '',
    startDate: '',
    endDate: '',

    buttonClicked: false,

    is_from_search: false,
    /** 
     * 控制上拉到底部时是否出现 "数据加载中..." 
     */  
    hidden: true,  
    hidden_last: true, 
    /** 
     * 数据是否正在加载中，避免数据多次加载 
     */  
    loadingData: false  
  },
  
  toSelectSearchType: function() {
    wx.navigateTo({
      url: '/pages/sw/instructionList/search/swSearch?title=' + this.data.title + '&receivedOrg=' + this.data.receivedOrg
      + '&receivedSn=' + this.data.receivedSn + '&importance=' + this.data.importance
      + '&securityClassification=' + this.data.securityClassification + '&complete=' + this.data.complete
      + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate
      + '&securityClassificationName=' + this.data.securityClassificationName
      + '&importanceName=' + this.data.importanceName + '&completeName=' + this.data.completeName
      + '&receivedOrgName=' + this.data.receivedOrgName
    })
  },

  // 收文审批详情页面
  instructionInfo: function(obj) {
    util.buttonClicked(this);
    var id = obj.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/sw/instructionList/info/info?id='+id,
    })
  },

  //列表查询接口，onshow中调用
  getInstructionList: function(tail, callback){
  
    var that = this;
    //请求审核记录
    wx.request({
      url: api.instructionList, //请求路径
      method: 'GET',
      data: {
        orderName: this.data.orderName,
        orderType: this.data.orderType,
        start: this.data.start,
        length: this.data.length,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        title: this.data.title,
        complete: this.data.complete,
        securityClassification: this.data.securityClassification,
        importance: this.data.importance,
        receivedSn: this.data.receivedSn,
        receivedOrg: this.data.receivedOrg,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        var oldList = that.data.instructionList;
        var newList = tail ? oldList.concat(res.data.data) : res.data.data; 
        that.setData({
          instructionList: newList,
          total: res.data.recordsFiltered
        });
        if (callback) {  
          callback();  
        } 
      },
      error: function(r) {  
        console.info('error', r);  
      },  
      complete: function() {}  
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = this;
    app.userLogin(function () {
      page.setData({
        hasUserInfo: app.globalData.hasUserInfo
      });
      if ( app.globalData.hasUserInfo ){
        page.getInstructionList();
      }
    }, function(){
      app.showToast('请先登录');
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
    //var that = this;
    if(this.data.is_from_search){
      this.getInstructionList();
      this.setData({
        is_from_search: false
      })
    }
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
    this.pullDownRefresh();
  },

  pullDownRefresh: function(){
    console.info('onPullDownRefresh');  
    var loadingData = this.data.loadingData,  
      that = this;
    if (loadingData) {  
      return;  
    } 
    this.setData({  
      start: 0   
    });  
    
    // 显示导航条加载动画  
    wx.showNavigationBarLoading();  
    // 显示 loading 提示框,在 ios 系统下，会导致顶部的加载的三个点看不见  
    // wx.showLoading({  
    //   title: '数据加载中...',  
    // });  
    setTimeout(function() {  
      that.getInstructionList(false, () => {  
        that.setData({  
          loadingData: false
        });  
        wx.stopPullDownRefresh();  
   
        wx.hideNavigationBarLoading();  
        console.info('下拉数据加载完成.');  
      });  
    }, 1000); 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var hidden_last = this.data.hidden_last;
    if(this.data.instructionList.length >= this.data.total){
      this.setData({  
        hidden_last: false  
      });
      return;
    }
      console.info('onReachBottom');  
      var hidden = this.data.hidden,  
        loadingData = this.data.loadingData,
        hidden_last = this.data.hidden_last,
        that = this;  
      if (hidden) {  
        this.setData({  
          hidden: false  
        });  
        console.info(this.data.hidden);  
      }  
      if (loadingData) {  
        return;  
      } 
      if (hidden_last) {  
        this.setData({  
          hidden_last: true  
        });  
      }
      
      var newStart =  that.data.start + that.data.length;
      console.log("newStart :" + newStart);
      this.setData({  
        loadingData: true, 
        start: newStart  
      });  

      setTimeout(function() {  
        that.getInstructionList(true, () => { 
          that.setData({  
            hidden: true,  
            loadingData: false
          });  
        });  
        console.info('上拉数据加载完成.');  
      }, 1000); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})