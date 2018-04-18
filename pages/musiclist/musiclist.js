var common = require("../../data/data.js");
var app = getApp();
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
    // var latelyPlayMusicList = options.latelyPlayMusicList
    // if (latelyPlayMusicList){
      var musicList = wx.getStorageSync('latelyPlayMusicList')
    // }
      console.log(musicList)
    this.setData({
      musicList
    })
  },

  /**
 * 打开搜索的音乐
 * */
  openmusic: function (ev) {
    var index = ev.currentTarget.dataset.index;
    console.log(index)
    app.globalData.songlist = this.data.musicList[index];
  
    console.log(this.data.musicList[index].songid)
    var songid = this.data.musicList[index].songid;
    // 将音乐设置为最近播放
    var latelyPlayMusicList = wx.getStorageSync('latelyPlayMusicList') || [];
    if (latelyPlayMusicList) {
      for (var i = 0, len = latelyPlayMusicList.length; i < len; i++) {
        if (latelyPlayMusicList[i].songid == songid) {
          console.log(211111111345423454)
          console.log(latelyPlayMusicList)
          latelyPlayMusicList.splice(i, 1)
        }
      }
    }
    latelyPlayMusicList.unshift(this.data.musicList[index])

    wx.setStorageSync('latelyPlayMusicList', latelyPlayMusicList)
    wx.navigateTo({
      url: '../latelyPlayMusic/latelyPlayMusic'
    })
  },
})