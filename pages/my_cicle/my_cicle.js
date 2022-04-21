import query from '../../utils/query'
Page({
  data:{

  },
  onLoad(){
    query.requestPromise('http://127.0.0.1:3000/users/my_cicle',{sign:wx.getStorageSync('_3rd_session')},'post')
    .then(res=>{
      console.log(res.data);
      res.data.cicle.forEach(item=>{
        item.area=item.area.substring(0,item.area.length-3);
      })
      res.data.comment.forEach(item => {
        item.pic=item.pic.split(',');
      });
      this.setData({
        area_list:res.data.cicle,
        comment:res.data.comment
      })
    })
  },
  comment_detail(e){
    wx.navigateTo({
      url: '../comment_detail/comment_detail?id='+e.currentTarget.dataset.id,
    })
  },
  openDetail(e){
    wx.navigateTo({
      url: '../cicle_detail/cicle_detail?id='+e.currentTarget.dataset.id,
    })
  },
})