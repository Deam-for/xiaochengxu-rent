Page({
  data:{
    rent_content:[
      {id:0,title:'求合租',content:'我要找合租房源和室友',avaurl:'../../image/check-circle-gray.png',sign:0},
      {id:1,title:'求整租',content:'我要找整租房源',avaurl:'../../image/check-circle-gray.png',sign:0}
    ],
    num:[],
    type:['求合租','求整租'],
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
    wx.navigateTo({
      url: '../publish_find_detail/publish_find_detail?type='+this.data.id,
    })
  }
})