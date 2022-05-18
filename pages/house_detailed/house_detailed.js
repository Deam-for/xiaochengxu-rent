import QQMapWX from '../../lib/qqmap-wx-jssdk.js'
import format from '../../utils/util'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import db from '../../utils/query'
let qqMap=new QQMapWX({
  key:'FMUBZ-Z3TKX-ZGT4B-ZLLJV-WKNMT-W3BOZ'
})
Page({
  data:{
    show:false,
    actions: [
      {
        name: '电话联系',
      },
      {
        name: '微信联系',
      },
    ],
    collection:false,
    date : {
      今天: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30','14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30','18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
      明天: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30','14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30','18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
    },
    dates:['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30','14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30','18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
  },
  onLoad(e){
    let id=this.options.id;
    this.setData({id})
    let that=this;
    let day=new Date().getDate()+2;
    let month=new Date().getMonth()+1;
    let msg=month+'月'+day+'号';
    this.data.date[msg]=this.data.dates;
    for (let index = 1; index <5; index++) {
      day+=1;
      msg=month+'月'+day+'号';
      this.data.date[msg]=this.data.dates;
    }
    let hour=new Date().getHours();
    let minutets=new Date().getMinutes();
    if(hour>10&&minutets>30){
      let num=(hour-10)*2+5
      this.data.date.今天.splice(0,num)
    }else if(hour>10&&minutets<30){
      let num=(hour-10)*2+4
      this.data.date.今天.splice(0,num)
    }
    console.log(hour);
    this.setData({
      columns: [
        {
          values: Object.keys(this.data.date),
          className: 'column1',
        },
        {
          values: this.data.date['今天'],
          className: 'column2',
          defaultIndex: 2,
        },
      ],
    })
    this.page_content(id)
  },
  onShow(){
    this.page_content(this.data.id)
  },
  page_content(id){
    let that=this
    wx.request({
      url: 'http://127.0.0.1:3000/house_detail',
      method:'POST',
      data:{id:id,
      openid:wx.getStorageSync('_3rd_session')},
      success(res){
        console.log(res.data);
        if(res.data.sign.length){
          that.data.collection=true
        }
        res.data.data.forEach(function(item,index ) {
          item.pic= item.pic.split(',');
          item.create_time=format.formatupadte(item.create_time);
        });
        // if(!res.data.comment){res.data.comment='暂时还没有人留言，快来抢沙发吧'}
        that.setData({
          house_info:res.data.data[0],
          collection:that.data.collection,
          comment:res.data.comment
        })
        let house_info=res.data.data[0];
        qqMap.geocoder({
          address:house_info.city+house_info.district+house_info.location,
          complete:res=>{
            house_info.location=res.result.address_components.district+res.result.title;
            that.setData({
              house_info:house_info,
              lng:res.result.location.lng,
              lat:res.result.location.lat
            })
          }
        })
      }
    })
  },
  openlocation(){
    let that=this;
    wx.openLocation({
      latitude: that.data.lat,
      longitude: that.data.lng,
      name:that.data.house_info.location,
      scale:18
    })
  },
  relation_type(){
    this.setData({
      show:true
    })
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    if(event.detail.name=='电话联系'){
      wx.setClipboardData({
        data:String(this.data.house_info.phone),
      })
    }else if(event.detail.name=='微信联系'){
      wx.setClipboardData({
        data: String(this.data.house_info.weixi),
      })
    }
  },
  collection(){
    this.setData({
      collection:(!this.data.collection)
    })
    console.log(this.data.house_info);
    let id=this.data.house_info.id;
    let user_id=wx.getStorageSync('_3rd_session');
    if(this.data.collection){
      wx.request({
        url: 'http://127.0.0.1:3000/house/collection',
        method:'POST',
        data:{
          id,user_id,type:'add'
        },
        success(res){
          if(res.data==200){
            wx.showToast({
              title: '收藏成功',
              icon:'success'
            })
          }
        }
      })
    }else{
      wx.request({
        url: 'http://127.0.0.1:3000/house/collection',
        method:'POST',
        data:{
          id,user_id,type:'delete'
        },
        success(res){
          if(res.data==200){
            wx.showToast({
              title: '收藏取消',
              icon:'success'
            })
          }
        }
      })
    }
  },
  publish_comment(){
    let a=this.data.house_info
    let data={};
    data.type='house'
    data.id=a.id;
    data.nickname=a.nickname;
    data.avatar_url=a.avatar_url;
    data.to_id=a.openid
    data=JSON.stringify(data);
    wx.navigateTo({
      url: '../publish_comment/publish_comment?data='+data,
    })
  },
  report(){
    console.log(this.data.house_info.id);
    wx.navigateTo({
      url: '../report/report?id='+this.data.house_info.id,
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, this.data.date[value[0]]);
  },
  openPicker(){
    this.setData({ schedule: true })
  },
  onConfirm(event){
    const { picker, value, index } = event.detail;
    console.log(value,index);
    this.setData({ schedule: false })
  },
  onClose() {
    this.setData({ show: false })
  },
  onCancel(){
    this.setData({ schedule: false })
  }
})