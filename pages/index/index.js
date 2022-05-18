import query from '../../utils/query'
import QQMapWX from '../../lib/qqmap-wx-jssdk.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import format from '../../utils/util'
let qqMap=new QQMapWX({
  key:'FMUBZ-Z3TKX-ZGT4B-ZLLJV-WKNMT-W3BOZ'
})
const app = getApp()
Page({
  data: {
    location:'',
    value:'',
  },
  onLoad(options) {
    if(options.id){
      this.page_content()
    }else{
      this.getlocation()
    }
  },
  getlocation(){
    console.log('as');
    let that=this;
    console.log('asd',app.golbalData.location);
    if(app.golbalData.location.length==false){
      wx.getLocation({
        isHighAccuracy: true,
      type: 'wgs84',
      success (res) {
        qqMap.reverseGeocoder({
          location:{
            latitude: res.latitude,
            longitude: res.longitude
          },
          success(res){
            let city=res.result.address_component.city;
            app.golbalData.location=city
            that.setData({
              location:city
            })
            that.page_content()
          },
          
        })
      },
      fail(){
        Dialog.confirm({
          selector: "#van-dialog", // Wxml文件中的 id，这里一定要加个# 不然会报查询不到van-dialog组件
          // title: 'Ip修改',
          message: '定位失败，请确定打开位置信息进行定位?',
          confirmButtonText:'重新定位',
          cancelButtonText:'手动定位'
        }).then(() => {
          that.getlocation()
        }).catch(() => {
          wx.navigateTo({
            url: '../city_select/city_select',
          })
        });  
      }
     })
    }else{
      let city=app.golbalData.location
      this.setData({
      location:city
    })
    }
  },
  house_detail(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../house_detailed/house_detailed?id='+id,
    })
  },
  onSearch(){
    wx.navigateTo({
      url: '../city_select/city_select',
    })
  },
  onShow(){
    this.page_content()
  },
  page_content(){
    let that=this;
    console.log('12'+app.golbalData.location)
    query.requestPromise('/house_info',{location:app.golbalData.location},'post')
    .then(res=>{
      console.log(res.data);
        res.data.info.forEach(function(item,index ) {
          item.pic= item.pic.split(',');
          item.pic.splice(3,5)
          item.create_time=format.formatupadte(item.create_time);
        });
        that.setData({
          house_info:res.data.info,
          banner:res.data.banner,
          location:app.golbalData.location
        })
    })
  },
  onClassify(e){
    wx.navigateTo({
      url: '../select_info/select_info?type='+e.currentTarget.dataset.type,
    })
  },
  onChange(e){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onClick(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onRefresh:function(){
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function(){
    this.onRefresh();
  },
})
