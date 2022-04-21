// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    avatarUrl:'../../image/avatar.png',
    nickName:'去登陆',
  },
  onLoad() {
    let avatarUrl=wx.getStorageSync('avatarUrl');
    let nickName=wx.getStorageSync('nickName');
    this.setData({
      avatarUrl:avatarUrl,
      nickName:nickName
    })
  },
  mylogin(){
    console.log('as');
    let that=this;
    wx.getUserProfile({
      desc: 'desc',
      success:(res)=>{
        let userinfo=res.userInfo;
        console.log(userinfo);
        wx.login({//获取登录凭证
          success: res => {
            console.log(res.code);
              wx.request({
                url: 'http://127.0.0.1:3000/users/wxlogin', // 登录路由
                method: 'POST',
                     data: {// 发送appid,appsecret和code到开发者服务器
                      "userinfo":userinfo,
                      "APPID": "wx055cbe7454283121",
                      "SECRET": "cc10ece1370f2bbf4f70d6dd235b2c00",
                      "JSCODE": res.code
                    },
                    // header: {
                    //   'Content-Type': 'application/x-www-form-urlencoded'
                    // },
                success(res) {
                    //将登录凭证_3rd_session存入缓存
                    that.setData({
                      avatarUrl:userinfo.avatarUrl,
                      nickName:userinfo.nickName
                    })
                    wx.setStorageSync("_3rd_session", res.data)
                    wx.setStorageSync('avatarUrl', userinfo.avatarUrl);
                    wx.setStorageSync('nickName', userinfo.nickName)
                }
          })
        }
      })
      }
    })
  },
  open_collection(){
    wx.navigateTo({
      url: '../collection/collection?type='+'collection',
    })
  },
  open_publish(){
    wx.navigateTo({
      url: '../collection/collection?type='+'publish',
    })
  },
  remove_house(){
    wx.navigateTo({
      url: '../collection/collection?type='+'remove',
    })
  },
  users_info(){
    wx.navigateTo({
      url: '../users_info/users_info',
    })
  },
  my_cicle(){
    wx.navigateTo({
      url: '../my_cicle/my_cicle',
    })
  },
  user_quit(){
    try {
      wx.clearStorageSync()
    } catch(e) {
      
    }
    this.setData({
      avatarUrl:'',
      nickName:''
    })
  }
})
