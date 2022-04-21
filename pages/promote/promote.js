import query from '../../utils/query'
Page({
  data:{
    fileList: [],
  },
  onLoad(options){
    let that=this;
   query.requestPromise('http://127.0.0.1:3000/house_detail',{id:this.options.id,
   openid:wx.getStorageSync('_3rd_session')},'post').
   then(res=>{
    let data=res.data.data;
    data.forEach(function(item){
      item.pic= item.pic.split(',')[0];
    })
    that.setData({
      content:data
    })
   })
  },
  afterRead(event) {
    const { file } = event.detail;
    this.data.fileList.push({url:file.url});
    console.log(file);
    this.setData({
      fileList:this.data.fileList
    })
  },
  title(e){
    this.setData({title:e.detail.value})
  },
  submit(){
    let data={};
    data.title=this.data.title;
    data.house_id=this.data.content[0].id;
    wx.uploadFile({
      url: 'http://127.0.0.1:3000/publish_rent/banner_add',
      filePath: this.data.fileList[0].url,
      name: 'img',
      formData: data,
      method:"post",
      header:{
        "Content-Type":"multipart/form-data"
      },
      success(res) {
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000
          })
      },
    });
  }
})