import query from '../../utils/query'
const app=getApp();
Page({
  data:{
    index:0,
    restrict:[{name:'不限男女'},{name:'只限男生'},{name:'只限女生'}],
    fileList: [],
    content:{"title":'',"money":'',"location":"","restrict":'不限男女','decrible':'','type':''},
    type:''
  },
  onLoad(options){
    let id=options.id;
    let that=this;
    console.log(id);
    query.requestPromise('/landlord/houseinfo_detail',{id:id,openid:wx.getStorageSync('_3rd_session')},'post')
    .then(res=>{
      res.data.forEach(function(item,index ) {
        item.pic= item.pic.split(',');
      });
      if(res.data[0].restricts=="男"){
        that.data.index=2
      }else if(res.data[0].restricts=="女"){
        that.data.index=1
      }
      res.data[0].location=res.data[0].district+res.data[0].location
      console.log(that.data.index);
      that.setData({
        content:res.data[0],
        index:that.data.index
      })
      console.log(that.data.content);
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
  openlocation:function(){  //选择位置
    let that=this;
    wx.chooseLocation({
      success:function(res){
        query.location(res.address).then(res=>{
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
  delete_pic(e){
    this.data.content.pic.splice(e.currentTarget.dataset.id,1)
    this.setData({
      content:this.data.content
    })
  },
  
  title(e){
    this.data.content.title=e.detail
    this.setData({content:this.data.content})
  },
  money(e){
    this.data.content.money=e.detail
    this.setData({content:this.data.content})
  },
  decrible(e){
    this.data.content.decrible=e.detail
    this.setData({content:this.data.content})
  },
  publish(){
    let that=this;
    this.data.content.session=wx.getStorageSync('_3rd_session');
    let pic='';
    let a=that.data.content.pic.length-1;
    this.data.content.pic.forEach(function(item,index){
      if(a==index){
        pic=pic+item;
      }else{
        pic=pic+item+',';
      }
      that.data.content.pic=pic;
    })
    if(this.data.fileList.length==0){
      wx.request({
        url: 'http://127.0.0.1:3000/landlord/houseinfo_update',
        method:'POST',
        data:{
          data:this.data.content
        },success(res){
          if(res.data==200){
            wx.showToast({
              title: '修改成功',
              icon:'success'
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }else{
        wx.uploadFile({
          url: 'http://127.0.0.1:3000/publish_rent/lanlord_update',
          filePath: this.data.fileList[0].url,
          name: 'img',
          formData: this.data.content,
          method:"post",
          header:{
            "Content-Type":"multipart/form-data"
          },
          success(res) {
            if(that.data.fileList.length>=2){
              app.uploadOneByOne('http://127.0.0.1:3000/publish_rent/pic',that.data.fileList,0,0,1,that.data.fileList.length,)
            }else{
              if(res.data==200){
                wx.showToast({
                  title: '修改成功',
                  icon:'success'
                })
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          },
        });
    }
  },
})