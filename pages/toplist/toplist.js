var common = require("../../data/data.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  dealColor: function (rgb) {
    if (!rgb) {
      return;
    }
    var r = (rgb & 0x00ff0000) >> 16,
      g = (rgb & 0x0000ff00) >> 8,
      b = (rgb & 0x000000ff);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var index = options.id;
   

    common.toplist_detailed(index, function (data) {
      var color = data.color.toString(16);
      if (color == 0) {
        color = "000";
      };   
      that.setData({
        songlist: data.songlist,
        update_time: data.update_time,
        ListName: data.topinfo.ListName,
        pic_album: data.topinfo.pic_album,
        bgcolor: color
      })
    })
  },
  // 跳转到播放页面
  autoplaymusic: function (ev) {
    var index = ev.currentTarget.dataset.play;  //获取ID
    app.globalData.songlist = this.data.songlist[index].data, //把数据保存在APP中
      wx.navigateTo({
        url: '../playmusic/playmusic'
      })
  },

})