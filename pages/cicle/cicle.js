import query from '../../utils/query'
const app=getApp();
Page({
  daat:{
    content:'',
    color:['#65c294','#ffce7b','#50b7c1','#90d7ec','#fcf16e']
  },
  onLoad(){
    console.log(Math.ceil(Math.random()*10));
  },
  onShow(){
    let that=this
    console.log(app.golbalData.location);
    query.requestPromise('/house/cicle',{location:app.golbalData.location},'post')
    .then(res=>{
      console.log(res.data)
      res.data.forEach(item=>{
        item.title=item.area.substring(0,item.area.length-3);
      })
      that.setData({
        area_list:res.data,
        content:res.data
      })
    })
  },
  openDetail(e){
    wx.navigateTo({
      url: '../cicle_detail/cicle_detail?id='+e.currentTarget.dataset.id,
    })
  },
  distirct(){
    let data=[];
    this.data.content.forEach(item=>{
      if(item.type=='商圈'){
        data.push(item)
      }
    })
    this.setData({
      area_list:data
    })
  },
  area(){
    let data=[];
    this.data.content.forEach(item=>{
      if(item.type=='区域'){
        data.push(item)
      }
    })
    this.setData({
      area_list:data
    })
  }
})