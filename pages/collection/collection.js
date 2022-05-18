import query from '../../utils/query'
Page({
  data:{
    activeNum:2,
    type:['publish','collection','remove','shenhefail']
  },
  onLoad(options){
    let type=options.type;
    if(type=='publish'){
      this.data.activeNum=1
    }else if(type=='remove'){
      this.data.activeNum=3
    }else if(type=='shenhefail'){
      this.data.activeNum=4
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
    let url='/users/'+type
    query.requestPromise(url,{id:wx.getStorageSync('_3rd_session')},'post')
    .then(res=>{
      console.log(res.data);
        let data=res.data;
        res.data.forEach(function(item){
          item.pic= item.pic.split(',')[0];
        })
        that.setData({
          collection_content:data
        })
    })
  },
  viewhouseDetail(e){
    if(this.data.activeNum==1||this.data.activeNum==4){
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
    query.requestPromise('/users/remove_house',{id:e.currentTarget.dataset.id,sign:wx.getStorageSync('_3rd_session')},'post')
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
  },
  collection(e){
    let that=this
    console.log(e.currentTarget.dataset.id);
    wx.request({
      url: 'http://127.0.0.1:3000/house/collection',
      method:'POST',
      data:{
        id:e.currentTarget.dataset.id,
        user_id:wx.getStorageSync('_3rd_session'),type:'delete'
      },
      success(res){
        if(res.data==200){
          wx.showToast({
            title: '收藏取消',
            icon:'success'
          })
          that.request_data('collection');
        }
      }
    })
  },
  shangjia(e){
    let that=this
    query.requestPromise('/users/shangjia',{id:e.currentTarget.dataset.id,
      user_id:wx.getStorageSync('_3rd_session')},'post')
      .then(res=>{
        if(res.data==200){
          that.request_data(that.data.type[that.data.activeNum-1])
        }
      })
  },
  onShow(){
    this.request_data(this.data.type[this.data.activeNum-1])
  }
})