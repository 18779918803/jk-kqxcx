const app = getApp();
var api = require("../../../../utils/sw_api");

Page({
  mixins: [require('../../../../dist/mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    startDate: '',
    endDate: '',
    receivedSn: '',
    receivedOrg: '',
    receivedOrgName: '',
    receivedOrgs: '',
    securityClassification: '',
    securityClassificationName: '',
    securityClassifications: '',
    importance: '',
    importanceName: '',
    importances: '',
    complete: '',
    completes: [
      { code: 1, name: "已归档" },
      { code: 2, name: "未归档" }
    ],
  },
  bindReceivedSnChange: function (e) {
    this.setData({
      receivedSn: e.detail.value,
    })
  },
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    });
    this.calcDay(this.data.startDate, this.data.endDate);
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    });
    this.calcDay(this.data.startDate, this.data.endDate);
  },
  bindReceivedOrgChange: function(e) {
    this.setData({
      receivedOrg: this.data.receivedOrgs[e.detail.value].code,
      receivedOrgName: this.data.receivedOrgs[e.detail.value].name,
    });
  },
  bindImportanceChange: function (e) {
    this.setData({
      importance: this.data.importances[e.detail.value].code,
      importanceName: this.data.importances[e.detail.value].name,
    });
  },
  bindCompleteChange: function (e) {
    this.setData({
      complete: this.data.completes[e.detail.value].code,
      completeName: this.data.completes[e.detail.value].name,
    });
  },
  bindSecurityClassificationChange: function (e) {
    this.setData({
      securityClassification: this.data.securityClassifications[e.detail.value].code,
      securityClassificationName: this.data.securityClassifications[e.detail.value].name,
    });
  },
  bindTitleChange: function(e) {
    this.setData({
      title: e.detail.value,
    })
  },
  calcDay: function (startDate, endDate) {
    var start_date = new Date(startDate.replace(/-/g, "/"));
    var end_date = new Date(endDate.replace(/-/g, "/"));
    var ms = end_date.getTime() - start_date.getTime();
    var day = parseInt(ms / (1000 * 60 * 60 * 24)) + 1;
    if( day == 1 ){
      this.setData({
        day: '',
        days: [{day: 0.5}, {day: 1}]
      });
    }else{
      this.setData({
        day: day,
        days: [{day: day}]
      });
    }
  },
  toSearch: function() {
    //start: this.data.start,
    //length: this.data.length,
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setData({
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      title: this.data.title,
      complete: this.data.complete,
      completeName: this.data.completeName,
      securityClassification: this.data.securityClassification,
      securityClassificationName: this.data.securityClassificationName,
      importance: this.data.importance,
      importanceName: this.data.importanceName,
      receivedSn: this.data.receivedSn,
      receivedOrg: this.data.receivedOrg,
      receivedOrgName: this.data.receivedOrgName,
      is_from_search: true,
    });
    wx.navigateBack({
      url: '/pages/sw/instruction/list'
    })
  },

  toReset: function() {
    this.setData({
      startDate: '',
      endDate: '',
      title: '',
      complete: '',
      completeName: '',
      securityClassification: '',
      securityClassificationName: '',
      importance: '',
      importanceName: '',
      receivedSn: '',
      receivedOrg: '',
      receivedOrgName: '',
    });
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      title: this.data.title,
      complete: this.data.complete,
      completeName: this.data.completeName,
      securityClassification: this.data.securityClassification,
      securityClassificationName: this.data.securityClassificationName,
      importance: this.data.importance,
      importanceName: this.data.importanceName,
      receivedSn: this.data.receivedSn,
      receivedOrg: this.data.receivedOrg,
      receivedOrgName: this.data.receivedOrgName,
    });
  },

  onLoad: function (options) {
    this.setData({
      receivedSn: options.receivedSn,
      receivedOrg: options.receivedOrg,
      receivedOrgName: options.receivedOrgName,
      importance: options.importance,
      importanceName: options.importanceName,
      securityClassification: options.securityClassification,
      securityClassificationName: options.securityClassificationName,
      complete: options.complete,
      completeName: options.completeName,
      title: options.title,
      startDate: options.startDate,
      endDate: options.endDate,
    });
    this.initSearchData()
  },

  initSearchData: function(){
    this.getDicList('sw_received_org');
    this.getDicList('sw_importance');
    this.getDicList('sw_security_classification');
  },

  getDicList: function(type){
    var that = this;
    wx.request({
      url: api.dicList, //请求路径
      data: {
        type: type,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        //console.log(res.data);
        if(type == 'sw_received_org'){
          that.setData({
            receivedOrgs: res.data.data,
          });
        }
        if(type == 'sw_importance'){
          that.setData({
            importances: res.data.data,
          });
        }
        if(type == 'sw_security_classification'){
          that.setData({
            securityClassifications: res.data.data,
          });
        }
      },
      fail(res) {
        app.showToast('服务器繁忙，请稍后再试\n' + '(状态码:500)');
      }
    });
  },
})