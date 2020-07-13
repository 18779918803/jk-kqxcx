// pages/sw/instructionList/info/info.js
const app = getApp();

var api = require("../../../../utils/sw_api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    id: '',
    currentRecord: '',
    instructionInfo: '',
    info : '',
    rootPath: api.rootPath,
    contentLength: 0,
    content: '',
  },

  //绑定批示内容
  bindContentChange: function(e) {
    var len = e.detail.value.length;
    this.setData({
      content: e.detail.value,
      contentLength: len,
    })
  },

  //绑定审批快捷词
  bindShortcutChange: function(e) {
    console.log(e);
    var newContent = this.data.content + e.target.dataset.value + "。";
    this.setData({
      content: newContent,
    })
    console.log(this.data.content);
  },

  // 收文审批详情页面
  instructionSwDetail: function(obj) {
    var url = this.data.info.url;
    console.log(url);
    wx.navigateTo({
      url: '/pages/sw/instructionList/pdf/detail?url='+url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
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
    var that = this;
    app.userLogin(function () {
      that.setData({
        hasUserInfo: app.globalData.hasUserInfo
      });
      if ( app.globalData.hasUserInfo ){
        that.getInstructionInfo();
      }
    }, function(){
      app.showToast('请先登录');
    });
  },

  //获取审批收文内容
  getInstructionInfo: function(){
    wx.showLoading({
      title: '加载中..',
      mask: true
    });
    var that = this;
    //请求审批收文详情信息
    wx.request({
      url: api.instructionInfo, //请求路径
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
        wx.hideLoading();
      },
      fail(res) {
        wx.hideLoading();
        app.showToast('服务器繁忙，请稍后再试\n' + '(状态码:500)');
      }
    });
  },

  //审批通过
  swPass: function() {
    if (this.data.content == '') {
      app.showToast('请批示');
      return;
    }
    wx.showLoading({
      title: '提交审批中',
      mask: true
    });
    wx.request({
      url: api.instruction, //请求路径
      data: {
        swid: this.data.info.swid,
        content: this.data.content,
        status: 2,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          is_from_search: true
        })
        console.log(res);
        if (res.statusCode == 200) {
          console.log(res.data);
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            
            wx.navigateBack({
              url: '/pages/sw/instructionList/list',
            })
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        }
      },
      fail () {
        console.log(res);
        console.log('程序出错了')
      }
    });
  },

  //审批驳回
  swReject: function() {
    if (this.data.content == '') {
      app.showToast('请批示');
      return;
    }
    wx.request({
      url: api.instruction, //请求路径
      data: {
        swid: this.data.info.swid,
        content: this.data.content,
        status: 3,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          is_from_search: true
        })
        console.log(res);
        if (res.statusCode == 200) {
          console.log(res.data);
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            wx.navigateBack({
              url: '/pages/sw/instructionList/list',
            })
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        }
      },
      fail () {
        console.log(res);
        console.log('程序出错了')
      }
    });
  },


  //打开文件
  preview: function () {
    app.showToast('文件加载中..');
    if(this.data.info.editable == 1){
      wx.navigateTo({
        url: '/pages/sw/instructionList/editor/editor?id='+ this.data.id,
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