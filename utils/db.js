// const RootPath = "http://127.0.0.1:20000/wss/";
// const wsPath = "ws://127.0.0.1:20000/wss/imserver";

const RootPath = "http://192.168.0.103:16006/kq";
const api = "/api/wechat/kq/";

// const RootPath = "http://localhost:16006/kq";
// const RootPath = "http://192.179.123.104:16006/kq";
// const RootPath = "http://23472d8b19.iok.la/kq";
// const RootPath = "http://192.179.123.108:16006/kq";


module.exports = {
  RootPath: RootPath, //根路径
  auth: RootPath + '/api/wechat/auth', //登录接口
  finishUrl: RootPath + api +'finish/list',  //已审核记录列表接口
  leaveList: RootPath + api +'leave/list',  //请加列表接口
   //提交核销申请
  subWriteoffApp:  RootPath+ api+"writeoff/insert",
  //获取当前用户有权限审核的审核列表
  checkDetail:  RootPath+ api +"/check/detail",
  dbUrl : RootPath + "/api/wechat/db/record/list",
};