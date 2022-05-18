// index.js
// 获取应用实例
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
                    if(res.data.msg==200){
                      that.setData({
                        avatarUrl:userinfo.avatarUrl,
                        nickName:userinfo.nickName
                      })
                      wx.setStorageSync("_3rd_session", res.data.a)
                      wx.setStorageSync('avatarUrl', userinfo.avatarUrl);
                      wx.setStorageSync('nickName', userinfo.nickName)
                    }else{
                      wx.showToast({
                        title: res.data.msg,
                        icon:'error'
                      })
                    }
                }
          })
        }
      })
      }
    })
  },
  open_collection(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../collection/collection?type='+'collection',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  open_publish(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../collection/collection?type='+'publish',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  remove_house(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../collection/collection?type='+'remove',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  open_fail(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../collection/collection?type='+'shenhefail',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  users_info(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../users_info/users_info',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  my_cicle(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
        url: '../my_cicle/my_cicle',
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
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
