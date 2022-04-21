// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goto_has_house(){
    wx.navigateTo({
      url: '../publish_has_house/publish_has_house',
    })
  },
  goto_find(){
    wx.navigateTo({
      url: '../publish_find/publish_find',
    })
  }
})