Page({
  data:{
    gender:['男','女'],
    age:['80后','85后','90后','95后','00后'],
    profession:['人力资源','文职','客户服务','IT互联网','电子通讯','机械','建设规划'],
    constellatory:['巨蟹座','水瓶座','射手座','摩羯座','金牛座','天秤座','白羊座','狮子座','双子座','处女座','天蝎座','双鱼座'],
    index:[0,0,0,0],
    array:[0,0,0,0,0,0]
  },
  onLoad(){
    let that=this;
    wx.request({
      url: 'http://127.0.0.1:3000/users/gain_userinfo',
      method:'POST',
      data:{id:wx.getStorageSync('_3rd_session')},
      success(res){
        let a=res.data[0];
        let array=that.data.array;
        if(a.gender==0){a.gender='男'}else{a.gender=='女'}
        array[0]=a.gender;
        array[1]=a.age;
        array[2]=a.work;
        array[3]=a.constellatory;
        array[4]=a.weixin;
        array[5]=a.phone;
        that.setData({
          array:array
        })
      }
    })
  },
  genderpickerchange:function(e){   
    this.data.array[0]=this.data.gender[e.detail.value];
    this.setData({
      array:this.data.array
    })
  },
  agepickerchange:function(e){   
    this.data.array[1]=this.data.age[e.detail.value];
    this.setData({
      array:this.data.array
    })
  },
  profession_pickerchange:function(e){   
    this.data.array[2]=this.data.profession[e.detail.value];
    this.setData({
      array:this.data.array
    })
  },
  weixin(e){
    this.data.array[4]=e.detail.value
    this.setData({array:this.data.array})
  },
  phone(e){
    this.data.array[5]=e.detail.value
    this.setData({array:this.data.array})
  },
    constellatory_pickerchange:function(e){   
      console.log(e.detail.value)
    this.data.array[3]=this.data.constellatory[e.detail.value];
    this.setData({
      array:this.data.array
    })
  },
  submit(){
    wx.request({
      url: '/users/users_info',
      method:'POST',
      data:{
        data:this.data.array,
        id:wx.getStorageSync('_3rd_session')
      },success(res){
        wx.showToast({
          title: '保存成功',
          icon:'success'
        })
      }
    })
  }
})