const db=require('../../utils/query')
Page({
  data:{},
  onLoad(options){
    let that=this;
    let type=options.type;
    db.requestPromise('/house/classify',{type},'post')
    .then(res=>{
        let data=res.data;
        res.data.forEach(function(item){
          item.pic= item.pic.split(',')[0];
        })
        that.setData({
          classify_content:data
        })
    })
  }
})