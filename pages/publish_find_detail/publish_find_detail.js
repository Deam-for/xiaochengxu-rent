import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app=getApp();
Page({
  data: {
    index:'',
    array:["不限男女","不限女","不限男"],
    fileList: [],
    content:{"title":'',"money":'',"location":"","restrict":'不限男女','decrible':'','type':''},
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type=options.type;
    console.log(type)
    this.data.content.type=type
    this.setData({content:this.data.content})
  },
  openlocation:function(){  //选择位置
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
  bindpickerchange:function(e){   //限制性别
    this.data.content.restrict=this.data.array[e.detail.value];
    this.setData({
      index:e.detail.value
    })
  },
  afterRead(event) {
    const { file } = event.detail;
    let pic=this.data.fileList.push({url:file.url,deletable: true});
    this.setData({
      fileList:this.data.fileList
    })
  },
  publish(){
    let that=this;
    console.log(this.data.content);
    this.data.content.session=wx.getStorageSync('_3rd_session');
    wx.uploadFile({
      url: 'http://127.0.0.1:3000/publish_rent/publish',
      filePath: this.data.fileList[0].url,
      name: 'img',
      formData: this.data.content,
      method:"post",
      header:{
        "Content-Type":"multipart/form-data"
      },
      success(res) {
        console.log(that.data.fileList.length);
        app.uploadOneByOne('http://127.0.0.1:3000/publish_rent/pic',that.data.fileList,0,0,1,that.data.fileList.length,)
        wx.switchTab({
          url: '../index/index',
        })
      },
    });
  },
  title(e){
    this.data.content.title=e.detail.value
    this.setData({content:this.data.content})
  },
  money(e){
    this.data.content.money=e.detail.value
    this.setData({content:this.data.content})
  },
  decrible(e){
    this.data.content.decrible=e.detail.value
    this.setData({content:this.data.content})
  }
})