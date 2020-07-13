// pages/sw/seeList/editor/editor.js
const app = getApp();

var api = require("../../../../utils/sw_api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    content: '',

    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    readOnly: false,
    formats: {},
  },

  //绑定文本内容
  bindTextChange: function(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  /**
   * 获取收文文本
   */
  getText:async function(id){
    var that = this;
    let p = new Promise(function(resolve, reject){
			setTimeout(function(){
        wx.request({
          url: api.swText, //请求路径
          method: 'GET',
          data: {
            id: id,     
          },
          header: {
            'content-type': 'application/json', // 默认值
            'thirdSession': app.globalData.thirdSession
          },
          success (res) {
            if (res.statusCode == 200) {
                resolve(res.data.data);
                that.setData({
                  content: res.data.data,
                })
              }else{
                reject(res.data.msg);
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 1000
                });
              }
              console.log(res);
          }
        });
      }, 2000);
    })
    return p
    //console.log("content: " + this.data.content);
  },

 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },


  onStatusChange: function(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  readOnlyChange: function() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  
  updatePosition: function(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },

  calNavigationBarAndStatusBar: function() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },

  onEditorReady:async function() {
    const that = this
    let result = await that.getText(that.data.id);
    //console.log("content: " + result);

    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context

      that.editorCtx.setContents({
        html: result,
        success:  (res)=> {
          console.log(res)
        },
        fail:(res)=> {
          console.log(res)
        }
      })
    }).exec()
    
  },
  blur: function() {
    this.editorCtx.blur()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    });

    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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