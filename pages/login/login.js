const App = getApp()
import __config from '../../etc/config'
Page({
  data: {
    logged: !1
  },
  wechatSignIn(cb) {
    /* if (App.WxService.getStorageSync('token')) 
       return */
    var entity={};
    App.WxService.login().then(data=>{
      console.log(data);
      entity.Code=data.code;
      wx.request({
        url: __config.webPath + "WxApplet/AppletLogin",
        method: 'POST',
        data: JSON.stringify(entity),    //参数为键值对字符串
        success: function (res) {
          if(res.statusCode==200){
            if(res.data.IsSuccess){
              var data = res.data.Data;
              var customerCode = data.CustomerCode;
              if(!customerCode){
                //绑定账号
                App.WxService.redirectTo('/pages/login/bind/bind?openid=' + data.OpenId);
              }else{
                console.log(data);
                wx.setStorageSync("token", data.Token);
                App.globalData.customerCode = data.Token.StaffId;
                cb();
              }
            }else{
              console.log("登录失败："+res.data.Message);
            }
          }else{
            App.showModal()
          }
        }
      });
    });
  },
  signIn(){
    this.wechatSignIn(this.goIndex);
  },
  goIndex() {
    App.WxService.switchTab('/pages/index/index')
  },
  onLoad() { },
  onShow() {
   /*  const token = App.WxService.getStorageSync('token')
    this.setData({
      logged: !!token
    })
    token && setTimeout(this.goIndex, 1500) */
  },
  goIndex() {
    App.WxService.switchTab('/pages/index/index')
  },
  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '获取用户登录状态失败，请重新登录',
      showCancel: !1,
    })
  }
})