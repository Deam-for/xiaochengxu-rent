import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app=getApp();
Page({
  data: {
   array:['天河租房圈','珠江新城租房圈'],
   index:0,
   fileList:[],
   content:{},
   message:''
  },
  bindpickerchange(e) {
    console.log(e.detail.value);
    this.data.content.cicle=this.data.array[e.detail.value]
    this.setData({
      content:this.data.content
    })
  },
  afterRead(event) {
    const { file } = event.detail;
    this.data.fileList.push(file);
    this.setData({
      fileList:this.data.fileList
    })
  },
  getlocation(){
    let that=this;
    wx.chooseLocation({
      success:function(res){
        that.data.content.location=res.address;
        that.setData({
          content:that.data.content
        })
      }
    })
  },
  textarea(e){
    this.data.content.message=e.detail
  },
  submit(){
    this.data.content.openid=wx.getStorageSync('_3rd_session')
    let that=this;
    wx.uploadFile({
      url: '/publish_rent/cicle_publish',
      filePath: this.data.fileList[0].url,
      name: 'img',
      formData: this.data.content,
      method:"post",
      header:{
        "Content-Type":"multipart/form-data"
      },
      success(res) {
        app.uploadOneByOne('/publish_rent/cicle_pic',that.data.fileList,0,0,1,that.data.fileList.length,)
        wx.switchTab({
          url: '../cicle/cicle',
        })
      },
    });
  }
})