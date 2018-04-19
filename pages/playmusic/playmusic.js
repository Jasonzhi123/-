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
    iscollection: true,
    shuffle: 1
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(options)
    var shuffle = wx.getStorageSync('shuffle') || 1;
    this.setData({ shuffle })
    console.log(shuffle)
    var columnNumber = options.columnNumber;  //栏目序号
    var that = this;
    var songlist = app.globalData.songlist;    //歌曲信息
    var songmid = songlist.songmid;
    var selectedIndex = options.index;           //歌曲排序号
    console.log(songlist)
    var filename = 'C400' + songmid +'.m4a'
    common.vkey(songmid,filename,function (data) {
      var vkey = data;
      console.log(vkey)
      that.setData({
        vkey
      })
      // 播放音乐
      that.autoplaymusic()
    })

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



    // 播放时长
    clearInterval(that.data.timer)
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

    //播放完歌曲
    wx.onBackgroundAudioStop(function () {
      console.log('播放完')
      var selectedIndex = that.data.selectedIndex;   //序号
      var columnSonglist = that.data.columnSonglist;   //歌单
      that.playmusic()   //暂停音乐
      var shuffle = that.data.shuffle;

      switch (shuffle) {
        case 1:
          // 顺序播放;
          selectedIndex++;
          break;
        case 2:
          // 单曲播放
          // selectedIndex = selectedIndex
          break;
        case 3:
          // 随机播放
          console.log('随机播放')
          let num = parseInt(Math.random() * 10)
          console.log(num)
          selectedIndex = parseInt(selectedIndex) + num
      }
      console.log(columnSonglist)
      console.log(selectedIndex)
      if (selectedIndex >= columnSonglist.length) {
        selectedIndex = 0
      }
      var songmid = columnSonglist[selectedIndex].data.songmid;
      var songlist = columnSonglist[selectedIndex].data;
      console.log(songlist)
      app.globalData.songlist = songlist;
      app.globalData.selectedIndex = selectedIndex;

      that.setData({
        songlist,
        songid: songlist.songid,
        selectedIndex,
        iscollection: true,
        imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
      })
      // 播放音乐
      that.playmusic()
      that.isCollection();  //判断是否已收藏

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
    this.isCollection();  //判断是否已收藏
  },
  /**
   * 判断是否收藏
   * */
  isCollection: function () {
    var that = this;
    var collectionList = wx.getStorageSync('collectionList');
    var songlist = this.data.songlist;
    if (collectionList) {
      for (var i = 0, len = collectionList.length; i < len; i++) {
        if (collectionList[i].songid == songlist.songid) {
          that.setData({
            iscollection: false
          })
        }
      }
    }
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
    var strMediaMid = this.data.songlist.strMediaMid;
    var vkey = this.data.vkey;
    console.log(vkey)
    console.log(this.data.songlist)
    wx.setStorageSync("songmid", songmid)
    if (this.data.imgpath == false) {
      if (strMediaMid) {
        wx.playBackgroundAudio({
          dataUrl: 'http://dl.stream.qqmusic.qq.com/C400' + strMediaMid + '.m4a?guid=9918820956&vkey=' + vkey +'&uin=0&fromtag=38'
        })
      } else {
        wx.playBackgroundAudio({
          dataUrl: 'http://dl.stream.qqmusic.qq.com/C400' + songmid + '.m4a?guid=2462755174&vkey=5BB891EDA9A13817C8BCBFFC25A9C7350650924E745965FD5E0B0B303364EB594C3C28BF7969FC96A9001A73BBA6EB847E63A3BB3F4BB7F0&uin=0&fromtag=38'
        })
      }
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
  },
  /**
   * 播放的顺序
   * */
  playshuffle: function (e) {
    console.log(e)
    var shuffle = this.data.shuffle;
    shuffle++;
    shuffle = shuffle > 3 ? 1 : shuffle;
    this.setData({
      shuffle: shuffle
    })
    var msg = "";
    switch (shuffle) {
      case 1:
        msg = "顺序播放";
        break;
      case 2:
        msg = "单曲播放";
        break;
      case 3:
        msg = "随机播放"
    }
    wx.setStorageSync('shuffle', shuffle)
    wx.showToast({
      title: msg,
      duration: 2000
    })
  },
  /**
   * 控制歌曲上下一首
   * */
  playother: function (e) {
    var num = e.currentTarget.dataset.other;
    var that = this;
    var selectedIndex = this.data.selectedIndex;  //歌曲序号
    var columnSonglist = this.data.columnSonglist;   //歌单
    selectedIndex = parseInt(num) + parseInt(selectedIndex)

    if (selectedIndex < 0 || selectedIndex > columnSonglist.length) {
      selectedIndex = 0
    }

    that.playmusic()   //暂停音乐

    var songmid = columnSonglist[selectedIndex].data.songmid;
    var songlist = columnSonglist[selectedIndex].data;

    app.globalData.songlist = songlist;
    app.globalData.selectedIndex = selectedIndex;

    that.setData({
      songlist,
      songid: songlist.songid,
      selectedIndex,
      iscollection: true,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg'
    })

    that.playmusic()   // 播放音乐
    that.isCollection();  //判断是否已收藏

    //设置导航栏 
    wx.setNavigationBarTitle({
      title: '歌曲：' + songlist.albumname
    })
  },
  /**
   * 收藏歌曲
   * */
  collection: function () {
    var that = this;
    var songlist = this.data.songlist;  //歌曲序号
    var iscollection = this.data.iscollection;
    var collectionList = wx.getStorageSync('collectionList') || [];
    if (iscollection) {
      collectionList.push(songlist)
      wx.showToast({
        title: '收藏成功',
        success: function () {
          wx.setStorageSync('collectionList', collectionList)
          that.setData({
            iscollection: false
          })
        }
      })
    } else {
      if (collectionList) {
        for (var i = 0, len = collectionList.length; i < len; i++) {
          if (collectionList[i].songid == songlist.songid) {
            collectionList.splice(i, 1)
            wx.showToast({
              title: '取消收藏',
              success: function () {
                wx.setStorageSync('collectionList', collectionList)
                that.setData({
                  iscollection: true
                })
              }
            })
            // wx.setStorageSync('collectionList', collectionList)            
            // that.setData({
            //   iscollection: true
            // })
            return
          }
        }
      }
    }
    // console.log(collectionList)

  },
  /**
   * 删除当前歌曲
   * */
  clearSongItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var columnSonglist = this.data.columnSonglist;
    columnSonglist.splice(index, 1)
    this.setData({
      columnSonglist
    })
  }

})