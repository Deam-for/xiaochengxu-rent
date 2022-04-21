import QQMapWX from '../lib/qqmap-wx-jssdk.js';
let qqMap=new QQMapWX({
  key:'FMUBZ-Z3TKX-ZGT4B-ZLLJV-WKNMT-W3BOZ'
})
const location = (location) => {
  return new Promise((resolve, reject) => {
    qqMap.geocoder({
      address:location,
      complete:res=>resolve(res)
    })
  })
}
const distance=(data,location)=>{
  let start='';
  let ending='';
  let that=this
  return new Promise((reslove,reject)=>{
     // for (let index = 0; index < data.length; index++) {
  //   let item = data[index];
  that.location(data).then(res=>{
    start=res.result.location.lat+','+res.result.location.lng
  });
  that.location(location).then(res=>{
    console.log(res.result.location);
    ending=res.result.location.lat+','+res.result.location.lng;
    qqMap.calculateDistance({
      from:start,
      to:ending,
      success(res){
        console.log(res);
        reslove(res)
      }
    })
  })

// }
  })
}

const requestPromise = (url,data,type) => {
  // 返回一个Promise实例对象 
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data:data,
      method:type,
      success: res => resolve(res)
    })
  })
}

module.exports={
  requestPromise,
  location,
  distance
}