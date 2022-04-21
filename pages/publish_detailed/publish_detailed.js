import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import query from '../../utils/query'
const app=getApp();
Page({
  data: {
    show:false,
    index:0,
    restrict:[{name:'不限男女'},{name:'只限男生'},{name:'只限女生'}],
    fileList: [],
    content:{"title":'',"money":'',"location":"","restrict":'','decrible':'','type':''},
    type:'',
    msg:{}
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
        query.location(res.address).then(res=>{
          that.data.msg.location='';
          that.data.content.city=res.result.address_components.city;
          that.data.content.province=res.result.address_components.province;
          that.data.content.district=res.result.address_components.district;
          that.data.content.location=res.result.address_components.street+res.result.title;
          that.setData({
            content:that.data.content,
            location:res.result.address_components.district+res.result.address_components.street+res.result.title,
            msg:that.data.msg
          })
        })
       
      }
    })
  },
  restrict(){
    this.setData({show:true})
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    this.data.content.restrict=event.detail.name
    this.setData({content:this.data.content})
  },
  afterRead(event) {
    const { file } = event.detail;
    let pic=this.data.fileList.push({url:file.url,deletable: true});
    this.data.msg.pic='';
    this.setData({
      fileList:this.data.fileList,
      msg:this.data.msg
    })
  },
  delete_pic(event){
    this.data.fileList.splice(event.detail.index,1);
    this.setData({
      fileList:this.data.fileList
    })
  },
  publish(){
    let that=this;
    let num=0
    let msg=this.data.msg;
    let content=this.data.content
    this.data.content.session=wx.getStorageSync('_3rd_session');
    if(content.title.length==0){
      msg.title='标题不能为空';
      num++
    }
    if(!(/^[0-9]*$/.test(content.money))){
      msg.rent='租金数额只能是数字'
      num++
    }else if(content.money.length==0){
      msg.rent='租金不能为零'
      num++
    } else if(content.money.length>5){
      msg.rent='租金最多只能为五位数';
      num++
    }
    if(content.location.length==0){
      msg.location='位置不能为空'
      num++
    }
    if(this.data.fileList.length==0){
      msg.pic='请选择上传的图片';
      num++
    }
    if(content.decrible.length==0){
      msg.decrible='详细描述不能为空';
      num++
    }
    if(content.restrict.length==0){
      this.data.content.restrict='不限男女'
    }
    if(num>0){
      console.log(this.data.content.money.length);
      this.setData({
        msg:msg
      })
    }
    else{
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
    }
  },
  title(e){
    this.data.content.title=e.detail;
    this.data.msg.title='';
    this.setData({content:this.data.content,msg:this.data.msg})
  },
  money(e){
    this.data.content.money=e.detail;
    if(!(/^[0-9]*$/.test(this.data.content.money))){
      this.data.msg.rent='租金数额只能是数字'
    }else if(this.data.content.money.length>5){
      this.data.msg.rent='租金最多只能为五位数'
    }else{this.data.msg.rent=''}
    this.setData({content:this.data.content,msg:this.data.msg})
  },
  decrible(e){
    this.data.content.decrible=e.detail;
    this.data.msg.decrible='';
    this.setData({content:this.data.content,msg:this.data.msg})
  }
})