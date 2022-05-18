import query from '../../utils/query'
Page({
  data:{
    textarea:''
  },
  onLoad(options){
    let data=JSON.parse(options.data)
    this.setData({
      content:data
    })
  },
  content(e){
    this.data.content.textarea=e.detail.value;
    this.setData({content:this.data.content})
  },
  submit(){
    this.data.content.sign=wx.getStorageSync('_3rd_session');
    query.requestPromise('/users/publish_comment',{data:this.data.content},'post')
    .then(res=>{
      if(res.data==200){
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  }
})