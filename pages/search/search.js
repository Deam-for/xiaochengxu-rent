import query from '../../utils/query'
import QQMapWX from '../../lib/qqmap-wx-jssdk.js';
let qqMap=new QQMapWX({
  key:'FMUBZ-Z3TKX-ZGT4B-ZLLJV-WKNMT-W3BOZ'
})
const app=getApp()
Page({
  data:{
    tuijian:true,
    scrollTop : 0,
    scrollHeight:0
  },
  onLoad(options){
    var that = this;
       wx.getSystemInfo({
           success:function(res){
               that.setData({
                   scrollHeight:res.windowHeight
               });
           }
       });
   this.setData({location:app.golbalData.location})
  },
  onclick(){
    this.setData({
      tuijian:true
    })
  },
  onChange(e){
    var _this = this;
    //调用关键词提示接口
    qqMap.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) {//搜索成功后的回调
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  openThis(e){
    this.setData({
      longitude:e.target.dataset.longitude,
      latitude:e.target.dataset.latitude,
      tuijian:!this.data.tuijian,
      city:this.data.suggestion[e.target.id].city
    })
    this.search(this.data.suggestion[e.target.id].district);
  },
  search(location){
    let that=this;
    query.requestPromise('http://127.0.0.1:3000/house/house_search',{location,city:this.data.city},'post')
    .then(res=>{
       let ending=that.data.latitude+','+that.data.longitude;
       console.log(res.data);
        that.distance(res.data,ending)
        .then(res=>{
          setTimeout(() => {
            that.sorts(res)
          }, 2000);
          // console.log(res);
          // that.setData({
          //   house_info:res
          // })
        })
    })
  },
  sorts(res){
    let temp=''
    for (let index = 1; index < res.length; ++index) {
      for (let item = 0; item < res.length-index; item++) {
        if((res[item].distance*10)>(res[item+1].distance*10)){
          temp=res[item]
          res[item]=res[item+1]
          res[item+1]=temp
        }
      }
    }
    this.setData({house_info:res})
  },
  distance(data, ending) {
    let start = '';
    let that = this
    return new Promise((reslove, reject) => {
        for (let index = 0; index < data.length; index++) {
          setTimeout(() => {
            let item = data[index];
            item.pic= item.pic.split(',')[0];
          that.location(item.city+item.district+item.location).then(res => {
            start = res.result.location.lat + ',' + res.result.location.lng
            qqMap.calculateDistance({
              mode: 'driving',
              from: start,
              to: ending,
              success(res) {
                console.log(res.result);
                item.distance = (res.result.elements[0].distance/1000).toFixed(1);
              }
            })
          });
          }, 1000);
        }
      reslove(data)
    })
  },
  location(e){
    return new Promise((reslove,reject)=>{
      qqMap.geocoder({
        address:e,
        success(res){
          console.log(res);
          reslove(res)
        },
        fail: function(error) {
          console.error(error);
        },
      })
    })
  },
  bindDownLoad(e){   
    var that = this;
    console.log(e);
    console.log("lower");
},
  scroll(event){
  //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  console.log(event.detail.scrollTop);
   this.setData({
       scrollTop : event.detail.scrollTop
   });
},
})