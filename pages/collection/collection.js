import query from '../../utils/query'
Page({
  data:{
    activeNum:2,
    type:['publish','collection','look']
  },
  onLoad(options){
    let type=options.type;
    if(type=='publish'){
      this.data.activeNum=1
    }else if(type=='remove'){
      this.data.activeNum=3
    }
    this.setData({
      activeNum:this.data.activeNum
    })
    this.request_data(type);
  },
  changeTab:function(e){
    let id=e.currentTarget.dataset.id;
    this.setData({activeNum:id});
    this.request_data(this.data.type[id-1])
  },
  request_data(type){
    let that=this;
    wx.request({
      url:'http://127.0.0.1:3000/users/'+type,
      method:'POST',
      data:{
        id:wx.getStorageSync('_3rd_session')
      },
      success(res){
        console.log(res.data);
        let data=res.data;
        res.data.forEach(function(item){
          item.pic= item.pic.split(',')[0];
        })
        that.setData({
          collection_content:data
        })
      },
    })
  },
  viewhouseDetail(e){
    if(this.data.activeNum==1){
      wx.navigateTo({
        url: '../publish_update/publish_update?id='+e.currentTarget.dataset.id,
      })
    }else if(this.data.activeNum==2){
      wx.navigateTo({
        url: '../house_detailed/house_detailed?id='+e.currentTarget.dataset.id,
      })
    }
  },
  remove_house(e){
    console.log(e.currentTarget.dataset.id);
    let that=this
    query.requestPromise('http://127.0.0.1:3000/users/remove_house',{id:e.currentTarget.dataset.id,sign:wx.getStorageSync('_3rd_session')},'post')
    .then(res=>{
      this.data.collection_content.forEach((item,index)=>{
        if(item.id==e.currentTarget.dataset.id){
          that.data.collection_content.splice(index,1)
        }
      })
      that.setData({
        collection_content:this.data.collection_content
      })
    })
  },
  promote(e){
    wx.navigateTo({
      url: '../promote/promote?id='+e.currentTarget.dataset.id,
    })
  }
})