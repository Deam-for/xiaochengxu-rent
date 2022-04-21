const db=require('../../utils/query')
Page({
  data:{},
  onLoad(options){
    let that=this;
    let type=options.type;
    db.requestPromise('http://127.0.0.1:3000/house/classify',type,'post')
    .then(res=>{
        let data=res.data;
        res.data.forEach(function(item){
          item.pic= item.pic.split(',')[0];
          // db.location(item.location).then(res=>{
          //   item.district=res.result.address_components.district+res.result.address_components.street;
          //       that.setData({
          //         classify_content:data
          //       })
          // })
        })
        that.setData({
          classify_content:data
        })
    })
  }
})