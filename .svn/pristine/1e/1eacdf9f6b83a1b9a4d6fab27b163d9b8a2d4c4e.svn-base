const app = getApp();

// 日历自定义配置
const conf = {
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      multi: false, // 是否开启多选,
      theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: false, // 单选模式下是否支持取消选中,
      chooseAreaMode: false, // 开启日期范围选择模式，该模式下只可选择时间段
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: false, // 是否禁用日历滑动切换月份
      // firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true, // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
      // 自定义，配置法定节假日的样式
      holidayPicture: '/images/holiday_fill.png',
      // disableMode: {  // 禁用某一天之前/之后的所有日期
      //   type: 'before',  // ['before', 'after']
      //   date: false, // 无该属性或该属性值为假，则默认为当天
      // },
    },
  },
};

Page({
  mixins: [
    require('../../dist/mixin/themeChanged'),
  ],
  data: {
    //日历配置
    calendarConfig: conf.data.calendarConfig,
    //当前选中的日期
    currentDate: '',
    //是否上拉
    isUp : true,
    //选中日期的打卡记录
    clock: [],
    // 国家法定节假日
    holiday: [],
    overtime: [],
    // 加班日期
    overtimes: [],
    //记录，请假或者已签到
    records: [],
    now: ''
  },
  
  calendarSwap: function() {
    if( this.data.isUp ){
      // 触发上拉事件，日历切换为周视图
      this.calendar.switchView('week').then(() => {});
      // 日历头部隐藏
      this.calendar.setCalendarConfig({
        hideHeadOnWeekMode: true,
      });
      // 图标切换为下拉视图
      this.setData({
        isUp: false
      });
      this.renderingData();
    }else{
      // 触发下拉事件，日历切换为月视图
      this.calendar.switchView().then(() => { });
      // 日历头部展示
      this.calendar.setCalendarConfig({
        hideHeadOnWeekMode: false,
      });
      // 图标切换为上拉视图
      this.setData({
        isUp: true
      })
    }
    this.calcScrollHeight();
  },
  /**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当multi为true时，allSelectedDays有值）
   */
  afterTapDay(e) {
    console.log(e);
    var date = this.dateToText(e.detail.year, e.detail.month, e.detail.day);
    this.setData({
      currentDate: date,
    });
    this.getClock(app.dateToString(e.detail.year, e.detail.month, e.detail.day));
  },
  /**
   * 当日历滑动时触发(适用于周/月视图)
   * 可在滑动时按需在该方法内获取当前日历的一些数据
   */
  onSwipe(e) {

  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    var year =  e.detail.next.year;
    var month = e.detail.next.month;
    var maxDay = new Date(year, month, 0).getDate();
    var day = this.calendar.getSelectedDay({lunar: true})[0].day;
    if(day > maxDay) {
      day = maxDay;
    };
    this.calendar.jump(year, month, day).then(date => {}); // 跳转至某日
    this.setData({
      currentDate: this.dateToText(year, month, day),
    });
    this.getHoliday(app.dateToString(year, month, day));
    this.getStatus(app.dateToString(year, month, day));
    this.getClock(app.dateToString(year, month, day));
  },

  calcScrollHeight: function(){
    var page = this;
    var query = wx.createSelectorQuery();
    query.select('#calendar').boundingClientRect()
    query.exec(function (res) {
      var calendarHeight = res[0].height;
      var res = wx.getSystemInfoSync();
      var scrollViewHeight = res.windowHeight - calendarHeight - 32;
      page.setData({
        scrollViewHeight: scrollViewHeight
      });
    });
  },

  onLoad: function() {
    const page = this;
    this.calcScrollHeight();
    var now = new Date();
    this.setData({
        now: now,
        currentDate: page.dateToText(now.getFullYear(), now.getMonth() + 1, now.getDate())
    });
    app.userLogin(function(){
      page.setData({
        hasUserInfo: app.globalData.hasUserInfo
      });
      page.getHoliday(app.dateToYearMonthDay(page.data.now));
      page.getStatus(app.dateToYearMonthDay(page.data.now));
      page.getClock(app.dateToYearMonthDay(page.data.now));
    });
  },

  onShow: function() {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo
    });
    if( this.data.hasUserInfo ){
      this.getHoliday(app.dateToYearMonthDay(this.data.now));
      this.getStatus(app.dateToYearMonthDay(this.data.now));
      this.getClock(app.dateToYearMonthDay(this.data.now));
    }
  },

  // //获取所有的请假记录
  // getLeaveRecords: function(){
  //   var that = this;
  //   //请求选中日期的打卡记录
  //   wx.request({
  //     url: app.globalData.url.leaveList, //请求路径
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json', // 默认值
  //       'thirdSession': app.globalData.thirdSession
  //     },
  //     success (res) {
  //       if (res.statusCode == 200) {
  //         if (res.data.code == 200) {
  //           that.setData({
  //             records: that.data.records.concat(that.dateToLeaveRecord(res.data.data)),
  //           })
  //           that.renderingData();
  //           console.log(that.data.records);
  //         }
  //       }
  //     }
  //   });
  // },

  // //将日期转换为请假记录
  // dateToLeaveRecord: function(data){
  //   var returnDatas = [];
  //   for(var obj of data) {
  //     var returnData = {};
  //     var date = new Date(obj.date);
  //     returnData.year = date.getFullYear();
  //     returnData.month = date.getMonth() + 1;
  //     returnData.day = date.getDate();
  //     returnData.todoText = '请假';
  //     returnData.color = 'red';
  //     returnDatas.push(returnData);
  //   }
  //   return returnDatas;
  // },

  //获取所有的签到记录
  // getPunchRecords: function(){
  //   var that = this;
  //   //请求选中日期的打卡记录
  //   wx.request({
  //     url: app.globalData.url.punchList, //请求路径
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json', // 默认值
  //       'thirdSession': app.globalData.thirdSession
  //     },
  //     success (res) {
  //       if (res.statusCode == 200) {
  //         if (res.data.code == 200) {
  //           that.setData({
  //             records: that.data.records.concat(that.dateToPunchRecord(res.data.data)),
  //           })
  //           that.renderingData();
  //           console.log(that.data.records);
  //         }
  //       }
  //     }
  //   });
  // },

  /*
  * 日历状态
  */
  getStatus: function (date) {
    var page = this;
    // 请求法定节假日信息
    wx.request({
      url: app.globalData.url.calendar.status, //请求路径
      method: 'POST',
      data:{
        date: date
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            var data = [];
            for (var obj of res.data.data) {
              var temp = {};
              var date = new Date(obj.time);
              temp.year = date.getFullYear();
              temp.month = date.getMonth() + 1;
              temp.day = date.getDate();
              // returnData.todoText = '已签到';
              temp.color = obj.color;
              data.push(temp);
            }
            page.setData({
              records: page.data.records.concat(data)
            })
            page.renderingData();
          }
        }else{
          console.log(res.data.exception);
        }
      }
    });
  },
  
  //判断加班日期是否为法定节假日
  dateIsHoliday: function(returnData) {
    for(var obj of this.data.holiday) {
      if(returnData.year == obj.year && returnData.month == obj.month && returnData.day == obj.day){
        return true;
      }
    }
    return false;
  },

  /*
   * 获取法定节假日的日期数据
   */
  getHoliday: function (date) {
    var page = this;
    // 请求法定节假日信息
    wx.request({
      url: app.globalData.url.calendar.holiday, //请求路径
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'thirdSession': app.globalData.thirdSession
      },
      data: {
        date: date
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            page.setData({
              holiday: page.numberToText(res.data.data.holiday, 'holiday'),
              overtime: page.numberToText(res.data.data.overtime, 'overtime'),
            })
            page.renderingData();
          }
        }
      }
    });
  },
  numberToText: function(data, cls){
    var returnDatas = [];
    for(var obj of data) {
      var returnData = {};
      var date = new Date(obj);
      returnData.year = date.getFullYear();
      returnData.month = date.getMonth() + 1;
      returnData.day = date.getDate();
      returnData.class = cls;
      returnDatas.push(returnData);
    }
    return returnDatas;
  },
  /*
   * 获取选中日期的打卡记录
   */
  getClock: function(date) {
    var that = this;
    //请求选中日期的打卡记录
    wx.request({
      url: app.globalData.url.calendar.clock,
      method: 'POST',
      data: {
        date: date,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'thirdSession': app.globalData.thirdSession
      },
      success (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            // for(var obj of res.data.data) {
            //   obj.punchTime = obj.punchTime.split(' ')[1];
            // }
            that.setData({
              clock: res.data.data,
            })
          }
        }
      }
    });
  },
  /*
  * 渲染数据，指定各种特殊日期的样式
  */
  renderingData: function() {
    this.calendar.setDateStyle(this.data.holiday);
    this.calendar.setDateStyle(this.data.overtime);
    this.calendar.setTodoLabels({
      pos: 'bottom', // 已签到和请假标记位置 ['top', 'bottom']
      dotColor: 'red', // 已签到和请假标记颜色
      circle: false, // 已签到和请假圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      showLabelAlways: true, //选中状态是否显示已签到和请假
      days: this.data.records,
    });
  },
  
  dateToText: function(year, month, day) {
    if(month <= 9) {
      month = '0' + month;
    }
    if(day <= 9) {
      day = '0' + day;
    }
    return year + "年" + month + "月" + day + "日";
  },
})
