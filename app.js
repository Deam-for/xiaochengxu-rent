import QQMapWX from 'lib/qqmap-wx-jssdk.js'
let qqMap=new QQMapWX({
  key:'FMUBZ-Z3TKX-ZGT4B-ZLLJV-WKNMT-W3BOZ'
})
App({
  golbalData:{
    location:''
  },
  onLaunch() {
    let that=this;
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  }, 
  //多图片上传
  uploadOneByOne(url, imgPaths, successUp, failUp, count, length) {
    var that = this;
    console.log(imgPaths);
    wx.uploadFile({
    url: url, //上传地址地址
    filePath: imgPaths[count].url,
    name: "img", //后台接收的文件名
    method:"post",
    header:{
      "Content-Type":"multipart/form-data"
    },
    success: function(e) {
    successUp++; //成功+1
    },
    fail: function(e) {
    failUp++; //失败+1
    },
    complete: function(e) {
    count++; //下一张
    if (count == length) {
    // TODO: 上传完毕后跳转页面
    wx.showToast({
    title: '发布成功',
    icon: 'success',
    duration: 2000
    })
    }
    else {
    //递归调用，上传下一张
    that.uploadOneByOne(url, imgPaths, successUp, failUp, count, length);
    }
    }
    })
    },
    //地址转换
    addresschange(location){
      let that=this
      qqMap.geocoder({
        address:location,
        complete:res=>{
          that.setDate({
            address:res.result
          })
        }
      })
    },
})
