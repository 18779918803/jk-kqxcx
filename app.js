//app.js

var api = require("./utils/api");
App({
  globalData: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //用户职位信息
    userPosition: {},
    currentRecord: {
      date: '',
      organ: '',
      reason: '',
    },
    //公用搜索，typeid表示是加班还是核销
    //organid表示部门目前没用
    search: {
      date: '',
      typePId: 0,
      organId: 0,
    },
    thirdSession: null,
    userKey: "third_session",
    //项目路径
    url: {
      auth: api.RootPath + "/api/wechat/auth",
      userInfo:  api.RootPath+"/api/wechat/userInfo",
      userData:  api.RootPath+"/api/wechat/userData",

      // position:  api.RootPath+"/api/wechat/kq/position",
      // positionList:  api.RootPath+"/api/wechat/kq/position/list",

      apply: {
        list: api.RootPath + "/api/apply/list",
        pass: api.RootPath + "/api/apply/pass",
        reject: api.RootPath + "/api/apply/reject",
        passBatch: api.RootPath + "/api/apply/passBatch",
        detail: api.RootPath + "/api/apply/detail",
      },
 
      calendar: {
        holiday: api.RootPath + "/api/calendar/holiday",
        status: api.RootPath + "/api/calendar/status",
        clock: api.RootPath + "/api/calendar/clock",
      },

      overtime: {
        add: api.RootPath + "/api/overtime/insert",
        list: api.RootPath + "/api/overtime/list",
      },

      leave: {
        add: api.RootPath + "/api/leave/insert",
        list: api.RootPath + "/api/leave/list",
      },

      writeoff: {
        add: api.RootPath + "/api/writeoff/insert",
        list: api.RootPath + "/api/writeoff/list",
      },
      
      //获取用户可以查看的部门信息列表
      organList:  api.RootPath+"sys/organ/list",
      //获取加班列表
      
      //获取出差列表
      travelList: api.RootPath+ "/api/wechat/kq/travel/list",
      //获取出差类型
      travelType:  api.RootPath+"/api/wechat/kq/travel/type",
      //提交出差申请
      subTravelApp:  api.RootPath+"/api/wechat/kq/travel/insert",
       //获取值班列表
       ondutyList: api.RootPath+ "/api/wechat/kq/onduty/list",
        //获取督查督办审批列表
      dbList: api.RootPath+ "/api/wechat/db/record/list",
      //督察督办审核通过申请记录
      dbRecordPass:  api.RootPath+"/api/wechat/db/record/pass",
      //督察督办审核拒绝申请记录
      dbRecordReject:  api.RootPath+"/api/wechat/db/record/reject",
       //内部借款审核记录
      loanList:  api.loanPath+"/api/wechat/loan/record/list",
      //内部借款审核通过
      loanRecordPass:  api.loanPath+"/api/wechat/loan/record/pass",
      //内部借款审核拒绝
      loanRecordReject:  api.loanPath+"/api/wechat/loan/record/reject",
      //内部借款已审批记录
      loanDoneList:  api.loanPath+"/api/wechat/loan/record/doneList",

      //内部借款详情页面
      loanCheckDetial: api.loanPath+"/api/wechat/loan/check/detail",

    },
    //考勤工作集合
    works: [
      {
        id: 1,
        name: '加班',
        icon: '/images/overtime_fill.png',
        url: '/pages/works/overtime/add/add',
      },
      {
        id: 2,
        name: '请假',
        icon: '/images/leave_fill.png',
        url: '/pages/works/leave/add/add',
      },
      {
        id: 3,
        name: '核销',
        icon: '/images/writeoff_fill.png',
        url: '/pages/works/writeoff/add/add',
      },
      // {
      //   id: 5,
      //   name: '收文审批',
      //   icon: '/images/writeoff_fill.png',
      //   url: '/pages/works/test/showPdf',
      // },
      // {
      //   id: 4,
      //   name: '出差',
      //   icon: '/images/travel_fill.png',
      //   url: '/pages/works/travel-record-list/travel-record-list',
      // },
      // {
      //   id: 5,
      //   name: '值班',
      //   icon: '/images/onduty_fill.png',
      //   url: '/pages/works/onduty-record-list/onduty-record-list',
      // },
    ]
  },
  //当页面加载的时候进行用户登录
  onLaunch: function() {
    // this.userLogin();
  },
  //用户登录，先检查checkSession是否过期
  userLogin: function (callback, fail) {
    const page = this;
    wx.checkSession({
      success: function () {
        console.log("checkSession未过期");
        //从app缓存中获取third_session，如果没有就执行onLogin()方法
        wx.getStorage({
          key: page.globalData.userKey,
          success: function (res) {
            console.log("checkSession -> getStorage 成功");
            page.globalData.thirdSession = res.data;
            page.getUserInfo(callback, fail);
          },
          fail: function (res) {
            console.log("checkSession -> getStorage 失败");
            page.onLogin(callback, fail);
          }
        })
      },
      fail: function () {
        console.log("checkSession已过期");
        page.onLogin();
      }
    })
  },
  //code to third_session的方法
  onLogin: function (callback, fail) {
    const page = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("onLogin成功");
          wx.request({
            url: page.globalData.url.auth,
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (res.data.code == 200) {
                  console.log("auth成功");
                  wx.setStorage({
                    key: page.globalData.userKey,
                    data: res.data.data
                  });
                  console.log("setStorage保存成功");
                  page.globalData.thirdSession = res.data.data;
                  page.getUserInfo(callback, fail);
                } else {
                  page.showToast(res.data.msg + '\n' + '(错误码:' + res.data.code + ')');
                }
              } else {
                page.showToast('服务器繁忙，请稍后再试\n' + '(状态码:' + res.statusCode + ')');
              }
            },
            fail: function (res) {
              page.showToast('服务器繁忙，请稍后再试\n' + '(状态码:500)');
            }
          })
        }
      },
      fail: function (res) {
        page.showToast('服务器繁忙，请稍后再试\n' + '(状态码:wx500)');
      }
    })
  },
  getUserInfo: function (callback, fail) {
    const page = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("getUserInfo用户已授权");
          wx.getUserInfo({
            success: res => {
              console.log("获取getUserInfo成功");
              console.log(res.userInfo);
              console.log('用户数据');
              page.userInfoSetInSQL(res.userInfo, callback);
            },
            fail: function () {
              console.log("获取getUserInfo失败");
              page.showToast('服务器繁忙，请稍后再试\n' + '(状态码:wx501)');
            }
          })
        } else {
          console.log(fail);
          typeof fail == 'function' && fail();
          console.log('getUserInfo用户未授权');
        }
      }
    })
  },
  //从数据库中获取用户数据
  userInfoSetInSQL: function (userInfo, callback) {
    const page = this;
    wx.getStorage({
      key: page.globalData.userKey,
      success: function (res) {
        console.log('userInfoSetInSQL -> wx.getStorage 成功 '+res.data);
        wx.request({
          url: page.globalData.url.userInfo,
          method: 'POST',
          data: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            province: userInfo.province,
            city: userInfo.city,
            country: userInfo.country,
            language: userInfo.language
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'thirdSession': res.data
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.code == 200) {
                console.log('userinfo更新成功');
                page.globalData.userInfo = userInfo;
                page.globalData.userInfo.organs = res.data.data.organs;
                page.globalData.userInfo.roles = res.data.data.roles;
                page.globalData.userInfo.organ = res.data.data.organ;
                page.globalData.userInfo.organId = res.data.data.organId;
                page.globalData.userInfo.roleId = res.data.data.roleId;
                page.globalData.userInfo.role = res.data.data.role;
                page.globalData.userInfo.name = res.data.data.name;
                page.globalData.userInfo.state = res.data.data.state;
                page.globalData.userInfo.stateText = res.data.data.stateText;
                page.globalData.hasUserInfo = true;
                // page.loadData(false, callback);
                typeof callback == 'function' && callback();
              } else {
                page.showToast(res.data.msg + '\n' + '(错误码:' + res.data.code + ')');
              }
            } else {
              page.showToast('服务器繁忙，请稍后再试\n' + '(状态码:' + res.statusCode + ')');
            }
          }
        })
      },
      fail: function (e) {
        console.log('userInfoSetInSQL -> wx.getStorage 失败');
      }
    })
  },
  showToast: function (msg, icon, complete) {
    icon = typeof (icon) == 'undefined' ? 'none' : icon;
    wx.showToast({
      title: msg,
      icon: icon,
      mask: true,
      duration: 2000,
      complete: function (res) {
        typeof complete == 'function' ? complete(res) : false;
      }
    });
  },
  //将js日期格式转换为yyyy-MM-dd的字符串格式的日期
  // dateToString: function(date) {
  //   var month = date.getMonth()+1;
  //   if(month <= 9) {
  //     month = '0' + month;
  //   }
  //   var day = date.getDate();
  //   if(day <= 9) {
  //     day = '0' + day;
  //   }
  //   return year + "-" + month + "-" + day;
  // },
  dateToYearMonthDay: function (date) {
    return this.dateToString(date.getFullYear(), date.getMonth() + 1, date.getDate());
  },
  dateToYearMonth: function (date) {
    return this.dateToString(date.getFullYear(), date.getMonth() + 1);
  },
  dateToString: function(year, month, day){
    if (month <= 9) {
      month = '0' + month;
    }
    if( day ){
      if (day <= 9) {
        day = '0' + day;
      }
      return year + "-" + month + "-" + day;
    }
    return year + "-" + month;
  },
  throwAppError: function() {
    wx.showToast({
      title: '程序出错了……',
      icon: 'none',
      duration: 1000
    })
  }
})