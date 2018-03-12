var common = require("../../data/data.js")
var app = getApp();
Page({

  /* 页面的初始数据*/
  data: {
    currentPosition: 0,  //初始化
    duration: 0,     //初始化
    width: 0,
    current_minute: 0,
    current_second: 0,
    imgpath:false
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    // 把数据从APP中取出来
    console.log(options)
    var that = this;
    var songlist = app.globalData.songlist;
    console.log(songlist)
    // var imgpath = app.globalData.imgpath;
    // console.log(imgpath)
    wx.setNavigationBarTitle({
      title: '歌曲：' + songlist.albumname
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      songlist: songlist,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
    });
    // 播放音乐
    this.autoplaymusic()

    // 音乐歌词
    // common.getLyric(songlist.songid, function (data) {
    //   console.log(data)
    //   var lyric = data.showapi_res_body.lyric;
    //   var re = /[^\u4e00-\u9fa5]/g; //找到中文
    //   var str = lyric.replace(re, "<br>");  //换行符
    //   var str1 = str.replace(/<br>\s*(<br>\s*)+/g, '  ');  //去掉多个br
    //   var arr = str1.replace(/<br>+/g, " ").split("  ");  //转化成数组
    //   var arr1 = arr.slice(4, arr.length)  //截取数组

    //   that.setData({
    //     lyricText: arr1
    //   })
    // }),

    // 播放时长
    clearInterval(that.data.timer),
      this.data.timer = setInterval(function () {
        wx.getBackgroundAudioPlayerState({
          success: function (res) {
            // console.log(res)
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

    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth
        })
      }
    })
  },

  //暂停音乐
  playmusic: function (ev) {
    // clearInterval(this.data.timer)
    var off = !this.data.imgpath
    this.setData({
      imgpath: off
    }),
    this.autoplaymusic()
  },

  // 播放音乐
  autoplaymusic() {
    var that = this;
    var songmid = this.data.songlist.songmid;
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

  //拖拽进度条
  movebar: function (ev) {
    //1.拖拽 事件就只有一个 bindtouchmove   
    //2. 获取 bar 的原点  X=ev.touches[0].clientX - bar.offsetLeft
    //3.页面初始化后马上获取 bar宽度 = 屏幕的宽度 - bar.offsetLeft * 2
    //4.改变当前的时间  
    //    公式：手指移动的距离 / bar的宽度 * 总时长
    //5.调用接口 wx.seekBackgroundAudio  改变当前时长

    var that = this;
    var X = ev.touches[0].clientX - ev.currentTarget.offsetLeft;
    var elewidth = this.data.windowWidth - ev.currentTarget.offsetLeft * 2
    wx.seekBackgroundAudio({
      position: X / elewidth * that.data.duration
    })

    this.setData({
      width: X / elewidth * 100
    })
  }
})