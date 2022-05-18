import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app=getApp();
Page({
  data: {
   array:['中介、托管公司或二手房东','骚扰','垃圾营销','淫秽色情'],
   index:0,
   fileList:[],
   content:{},
   message:''
  },
  onLoad(options){
    console.log(options.id);
    this.data.content.id=options.id
    this.setData({content:this.data.content})
  },
  bindpickerchange(e) {
    console.log(e.detail.value);
    this.data.content.cause=this.data.array[e.detail.value]
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
  textarea(e){
    this.data.content.content=e.detail
  },
  submit(){
    this.data.content.openid=wx.getStorageSync('_3rd_session')
    console.log(this.data.content);
    let that=this;
    wx.uploadFile({
      url: '/publish_rent/report',
      filePath: this.data.fileList[0].url,
      name: 'img',
      formData: this.data.content,
      method:"post",
      header:{
        "Content-Type":"multipart/form-data"
      },
      success(res) {
        console.log(that.data.fileList.length);
        app.uploadOneByOne('/publish_rent/report_pic',that.data.fileList,0,0,1,that.data.fileList.length,)
        wx.switchTab({
          url: '../cicle/cicle',
        })
      },
    });
  }
})