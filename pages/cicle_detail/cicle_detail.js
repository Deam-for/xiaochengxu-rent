import query from '../../utils/query'
import  format from '../../utils/util'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app=getApp();
Page({
  data:{
    showShare: false,
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '微博', icon: 'weibo' },
      { name: '复制链接', icon: 'link' },
      { name: '分享海报', icon: 'poster' },
      { name: '二维码', icon: 'qrcode' },
    ],
  },
  onLoad(options){
    console.log(options.id)
   this.setData({id:options.id})
  },
  onShow(){
    this.content();
  },
  content(){
    query.requestPromise('/house/ciclecomment',{id:this.data.id,sign:wx.getStorageSync('_3rd_session')},'post')
    .then(res=>{
      console.log(res.data);
      if(res.data.sign){
        res.data.content.forEach(item=>{
          item.pic= item.pic.split(',');
          item.create_time=format.formatupadte(item.create_time);
        })
      }
      let title=(res.data.content[0].city_area).substring(0,res.data.content[0].city_area.length-3);
      this.setData({
        comment:res.data.content,
        title:title,
        thumbs:res.data.thumbs,
        sign:res.data.sign,
        city_area:res.data.city_area[0]
      })
    })
  },
  openDetail(){
    wx.navigateTo({
      url: '../cicle_detail/cicle_detail',
    })
  },
  openpbulish(){
    wx.navigateTo({
      url: '../cicle_pbulish/cicle_publish',
    })
  },
  join(){
    console.log(this.data.thumbs);
    let that=this;
    if(this.data.thumbs){
      query.requestPromise('/house/cicle_quit',{location:app.golbalData.location,sign:wx.getStorageSync('_3rd_session'),city_area:this.data.id},'post')
    .then(res=>{
      wx.showToast({
        title: '已退出',
        icon:'fail'
      })
      that.content()
    })
    }else{
      query.requestPromise('/house/cicle_join',{location:app.golbalData.location,sign:wx.getStorageSync('_3rd_session'),city_area:this.data.id},'post')
    .then(res=>{
      wx.showToast({
        title: '已加入',
        icon:'success'
      })
      that.content()
    })
    }
    
  },
  onshare(){
    this.setData({ showShare: true });
  },
  onClose() {
    this.setData({ showShare: false });
  },

  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },
  dianzan(e){
    console.log(e.currentTarget.dataset.id);
    let id=e.currentTarget.dataset.id;
    this.data.comment[id].dianzan=!( this.data.comment[id].dianzan);
    query.requestPromise('/house/dianzan',{sign:wx.getStorageSync('_3rd_session'),id:this.data.comment[id].id},'post').then(res=>{

    })
    this.setData({
      comment:this.data.comment
    })
  },
  delete_dianzan(e){
    let id=e.currentTarget.dataset.id;
    this.data.comment[id].dianzan=!( this.data.comment[id].dianzan);
    query.requestPromise('/house/delete_dianzan',{sign:wx.getStorageSync('_3rd_session'),id:this.data.comment[id].id},'post').then(res=>{

    })
    this.setData({
      comment:this.data.comment
    })
  },
  comment_detail(e){
    wx.navigateTo({
      url: `../comment_detail/comment_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  shouye(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  my(){
    wx.switchTab({
      url: '../my/my',
    })
  }
})