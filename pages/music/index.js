var common = require("../../data/data.js");
var app = getApp();
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ["推荐", "排行榜", "搜索"],
    navcur: 2,
    searchshow: true,
    searchvalue: "搜索",
    musicshow: false,
    isLoadSearchData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 推荐页面
    common.slider(function (data) {
      console.log(data);
      that.setData({
        slider: data.data.slider,
        radioList: data.data.radioList,
        songList: data.data.songList
      })
    });

    // 排行榜
    common.topList(function (data) {
      that.setData({
        topList: data.data.topList
      })
    });

    // 搜索
    common.search(function (data) {
      that.setData({
        search: data.data.hotkey.slice(11, 19),
        searchTitle: data.data.special_key
      })
    });

    //  播放器
    setInterval(function () {
      if (app.globalData.songlist) {
        if (songlist) return;
        var songlist = app.globalData.songlist;
        that.setData({
          songname: app.globalData.songlist.songname,
          songername: songlist.singer[0].name,
          imgpath: app.globalData.imgpath,
          imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songlist.albummid + '.jpg',
          musicshow: true
        });
      }
    }, 5000);
  },

  //导航栏点击事件
  navtab: function (ev) {
    var index = ev.currentTarget.dataset.navid;
    this.setData({
      navcur: index
    })
  },

  openmusicradiostation: function (ev) {
    console.log(ev);
    console.log(this)
    common.radioStation(function (data) {

    });
  },

  //排行榜上打开跳转音乐列表
  opentoplist: function (ev) {
    var id = ev.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../toplist/toplist?id=' + id
    })
  },


  //输入框当键盘输入时，触发input事件
  bindKeywordInput: function (ev) {
    this.setData({
      searchkey: ev.detail.value,
      searchshow: false,
    })
  },

  // 点击搜索框时，把输入的数据传到api中
  searchBtn: function () {
    var that = this;
    var val = this.data.searchkey;  //输入的关键字
    if (val == undefined || val == ''){
      wx.showToast({
        title: '不能为空',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    var searchId =1;
    this.setData({
      val,
      searchId,
      isLoadSearchData:true
    })
    this.getSearchData(val, searchId)
  },

  // 上拉加载
  scrolltolower: function (ev) {
    var that = this;
    var searchId= that.data.searchId + 7;
    var val = this.data.val;
    that.setData({
      searchId ,
      isLoadSearchData: false
    })
    this.getSearchData(val, searchId);
  },
  /**
   * 获取搜索数据
   * */
  getSearchData: function (val, searchId) {
    var that=this;
    var isLoadSearchData = this.data.isLoadSearchData;
    common.searchresult(val, searchId, function (data) {
      var searchlist;
      if (data.data.song.list.length == 0){
        that.setData({
          noLoadData:true
        })
      }
      isLoadSearchData ? searchlist = data.data.song.list : searchlist = that.data.searchlist.concat(data.data.song.list)
      that.setData({
        searchlist: searchlist,
        searchshow: false,
      })
    })
  },
  // 打开音乐
  openmusic: function (ev) {
    var index = ev.currentTarget.dataset.searchid;
    app.globalData.songlist = this.data.searchlist[index]
    wx.navigateTo({
      url: '../playmusic/playmusic'
    })
  },

  // 切换音乐
  Togglesong: function (ev) {
    var off = !this.data.imgpath;
    app.globalData.imgpath = off;
    this.setData({
      imgpath: off
    })
    var songmid = wx.getStorageSync('songmid')
    if (this.data.imgpath == false) {
      console.log(songmid)
      wx.playBackgroundAudio({
        dataUrl: 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=38'
      })
    } else {
      wx.pauseBackgroundAudio()
    }
    app.globalData.imgpath = this.data.imgpath;
  },
  // 打开音乐页面
  openmusicpage: function () {
    wx.navigateTo({
      url: '../playmusic/playmusic'
    })
  },
  /**
   * 打开热歌
   * */
  openHotSong: function (e) {
    common.hotSong(function (data) {

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