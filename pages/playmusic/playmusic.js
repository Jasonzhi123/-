var common = require("../../data/data.js")
var app = getApp();
Page({

  data: {
    currentPosition: 0,  //初始化
    duration: 0,     //初始化
    width: 0,
    current_minute: 0,
    current_second: 0,
    imgpath: false,
    shuffle:1
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(options)
    var columnNumber = options.columnNumber;  //栏目序号
    var that = this;
    var songlist = app.globalData.songlist;    //歌曲信息
    var selectedIndex=options.index;           //歌曲排序号

    // 获取栏目歌曲列表
    if (columnNumber) {
      common.toplist_detailed(columnNumber, function (data) {
        var columnSonglist = data.songlist;
        app.globalData.columnSonglist = columnSonglist;
        app.globalData.selectedIndex = selectedIndex;
        that.setData({
          columnSonglist,
          selectedIndex
        })
      })
    }
    // 从首页进来，使用全局变量传参
    if (app.globalData.columnSonglist) {
      that.setData({
        columnSonglist: app.globalData.columnSonglist,
        selectedIndex: app.globalData.selectedIndex,
      })
    }

    //设置导航栏 
    wx.setNavigationBarTitle({
      title: '歌曲：' + songlist.albumname
    })

    this.setData({
      songlist: songlist,
      songid: songlist.songid,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
    });

    // 播放音乐
    this.autoplaymusic()

    // 播放时长
    clearInterval(that.data.timer)
    this.data.timer = setInterval(function () {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          that.setData({
            currentPosition: res.currentPosition, //当前时间
            duration: res.duration, //总时间
            current_minute: parseInt(res.currentPosition / 60),  //当前分钟
            current_second: parseInt(res.duration / 60), //总分钟
            width: res.currentPosition / res.duration * 100  //进度条的宽度
          })
        }
      })
    }, 1000)

    //播放完歌曲
    wx.onBackgroundAudioStop(function () {
      console.log('播放完')
      var selectedIndex = that.data.selectedIndex;
      var columnSonglist = that.data.columnSonglist;
      that.playmusic()
      selectedIndex++;
      console.log(columnSonglist)
      var songmid = columnSonglist[selectedIndex].data.songmid;
      var songlist = columnSonglist[selectedIndex].data;
      console.log(songlist)
      app.globalData.songlist = songlist;
      app.globalData.selectedIndex = selectedIndex;

      that.setData({
        songlist,
        songid: songlist.songid,
        selectedIndex,
        imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
      })
      // 播放音乐
      that.autoplaymusic()

      // //设置导航栏 
      wx.setNavigationBarTitle({
        title: '歌曲：' + songlist.albumname
      })
    })

    // 设置导航栏
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },

  /**
   * 暂停音乐
  */
  playmusic: function (ev) {
    var off = !this.data.imgpath
    this.setData({
      imgpath: off
    }),
    this.autoplaymusic()
  },

  /**
   * 播放音乐
   * */
  autoplaymusic() {
    var that = this;
    var songmid = this.data.songlist.songmid;
    console.log(this.data.songlist)
    wx.setStorageSync("songmid", songmid)
    if (this.data.imgpath == false) {
      wx.playBackgroundAudio({
        dataUrl: 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=38'
      })
    } else {
      wx.pauseBackgroundAudio()
    }
    app.globalData.imgpath = this.data.imgpath;
  },

  /**
   * 拖拽进度条
  */
  movebar: function (ev) {
    var that = this;
    var X = ev.touches[0].clientX - ev.currentTarget.offsetLeft;
    var elewidth = this.data.windowWidth - ev.currentTarget.offsetLeft * 2
    wx.seekBackgroundAudio({
      position: X / elewidth * that.data.duration
    })

    this.setData({
      width: X / elewidth * 100
    })
  },

  /**
   * 点击换歌曲
   * */
  clickOpenMusic: function (e) {
    console.log(e)
    var songmid = e.currentTarget.dataset.songmid;
    var songlist = e.currentTarget.dataset.songlist;
    var selectedIndex = e.currentTarget.dataset.index;
    
    app.globalData.songlist = songlist;
    app.globalData.selectedIndex = selectedIndex;
    
    this.setData({
      songlist,
      songid: songlist.songid,      
      selectedIndex,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
    })
    // 播放音乐
    this.autoplaymusic()

    //设置导航栏 
    wx.setNavigationBarTitle({
      title: '歌曲：' + songlist.albumname
    })
  },

  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  }
})