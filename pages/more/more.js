


// pages/more/more.js
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
    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            that.setData({
              userInfo
            })
          }
        })
      }
    })
  },

  /**
   * 打开喜欢歌曲
   * */
  openLikeMusic: function () {
    wx.navigateTo({
      url: '../musiclist/musiclist?latelyPlayMusicList=' + 'latelyPlayMusicList',
    })
  }
})