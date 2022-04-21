import query from '../../utils/query'
import format from '../../utils/util'
Page({
  data:{

  },
  onLoad(options){
    console.log(options);
    query.requestPromise('http://127.0.0.1:3000/house/comment_detail',{id:options.id},'post')
    .then(res=>{
      console.log(res.data);
      let data=res.data.data[0];
      data.create_time=format.formatupadte(data.create_time);
      data.pic= data.pic.split(',');
      this.setData({
        content:data,
        comment:res.data.comment
      })
    })
  },
  comment(){
    let a=this.data.content
    let data={};
    data.type='cicle'
    data.id=a.id;
    data.nickname=a.nickname;
    data.avatar_url=a.avatar_url;
    data.to_id=a.openid
    data=JSON.stringify(data);
    wx.navigateTo({
      url: '../publish_comment/publish_comment?data='+data,
    })
  }
})