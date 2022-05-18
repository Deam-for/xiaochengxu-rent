import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data:{
    rent_content:[
      {id:0,title:'合租找室友',content:'我要找室友合租',avaurl:'../../image/check-circle-gray.png',sign:0,pic:'../../image/zhaoshiyou.png'},
      {id:1,title:'转租单间',content:'房子是我租的，我要转租',avaurl:'../../image/check-circle-gray.png',sign:0,pic:'../../image/zhuanzu.png'},
      {id:2,title:'房东直租',content:'需上传房产证或购房合同',avaurl:'../../image/check-circle-gray.png',sign:0,pic:'../../image/zhengzu.png'}
    ],
    num:[],
    type:['找室友','转租','房东直租'],
    id:''
  },
  onLoad(){

  },
  select(e){
    if(this.data.num.length>0){
     let num=this.data.num.pop();
      let a="rent_content["+num+"].sign";
      this.setData({
        [a]:!(this.data.rent_content[num].sign)
      })
    }
    let id=e.currentTarget.dataset.id;
    this.data.id=this.data.type[id];
    this.data.num.push(id);
    let data="rent_content["+id+"].sign";
    this.setData({
      [data]:!(this.data.rent_content[id].sign)
    })
  },
  next_select(){
    if(wx.getStorageSync('_3rd_session')){
      wx.navigateTo({
      url: '../publish_detailed/publish_detailed?type='+this.data.id,
    })
    }else{
      Dialog.confirm({
        message: '请先进行登录',
        confirmButtonText:'去登录',
      })
        .then(() => {
          wx.switchTab({
            url: '../my/my',
          })
        })
        .catch(() => {
          // on cancel
        });
    }
    
  }
})