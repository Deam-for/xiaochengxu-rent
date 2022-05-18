import query from '../../utils/query'
import format from '../../utils/util'
Page({
  data:{
    data:{},
    comment_text:''
  },
  onLoad(options){
    this.setData({comment_id:options.id})
    this.page_content()
  },
  onShow(){
    this.page_content()
  },
  page_content(){
    query.requestPromise('/house/comment_detail',{id:this.data.comment_id},'post')
    .then(res=>{
      console.log(res.data);
      let data=res.data.data[0];
      data.create_time=format.formatupadte(data.create_time);
      data.pic= data.pic.split(',');
      this.setData({
        content:data,
        comment:res.data.comment,
        reply_content:res.data.reply
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
  },
  replyComment(e) {
    let data=this.data.data
     data.cid = e.currentTarget.dataset.cid; //当前点击的评论id
     data.reply_name = e.currentTarget.dataset.name; //当前点击的评论昵称
     data.comment_id = e.currentTarget.dataset.pid; //当前点击的评论所属评论id
     let type = e.currentTarget.dataset.type; //当前回复类型
    this.setData({
      focus: true, //输入框获取焦点
      placeholder: '回复' +  data.reply_name + '：', //更改底部输入框占字符
      now_reply_type: type, //获取类型(1回复评论/2回复-回复评论)
    })
  },
  confirm(e){
    let that=this;
    let data=this.data.data;
    data.comment=e.detail.value;
    data.openid=wx.getStorageSync('_3rd_session')
    console.log(data);
    query.requestPromise('/house/reply_comment',{data},'post')
    .then(res=>{
      if(res.data==200)
      that.page_content()
    })
    this.setData({comment_text:''})
  }
})