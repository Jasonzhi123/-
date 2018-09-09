var common = require("../../data/data.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ["推荐", "排行榜", "搜索"],
    navcur: 1,
    searchshow: true,
    searchvalue: "搜索",
    musicshow: false,
    isLoadSearchData: true,
    searchHistory: wx.getStorageSync('searchHistory'),
    showSearchHistory: true
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
      console.log(data)
      that.setData({
        search: data.data.hotkey.slice(3, 12),
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
    console.log(ev)
    this.setData({
      searchKey: ev.detail.value,  //关键字
      searchshow: false,  //隐藏热门搜索
      isShowClear: true
    })
    if (ev.detail.value == '' || ev.detail.value == undefined) {
      this.setData({
        searchshow: true, //显示热门搜索
        searchlist: [],      //清空搜索数组
        showSearchHistory: true    //显示历史搜索
      })
    }
  },

  // 点击搜索框时，把输入的数据传到api中
  searchBtn: function () {
    var that = this;
    var val = this.data.searchKey;  //输入的关键字
    if (val == undefined || val == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'success',
        duration: 1000
      })
      return;
    }

    var searchHistory = this.data.searchHistory || [];   //获取历史搜索记录
    searchHistory.unshift(val);        //添加记录
    if (searchHistory.length > 5) {    //自动删除最后一个
      searchHistory.pop();
    }
    wx.setStorageSync('searchHistory', searchHistory)

    var searchId = 1;
    this.setData({
      val,
      searchId,
      isLoadSearchData: true,
      searchHistory: searchHistory,
      showSearchHistory: false   //隐藏历史搜索
    })
    this.getSearchData(val, searchId)   //获取搜索数据
  },

  // 上拉加载
  scrolltolower: function (ev) {
    var that = this;
    var searchId = that.data.searchId + 7;
    var val = this.data.val;
    that.setData({
      searchId,
      isLoadSearchData: false
    })
    this.getSearchData(val, searchId);    //获取搜索数据
  },

  /**
   * 获取搜索数据
   * */
  getSearchData: function (val, searchId) {
    var that = this;
    var isLoadSearchData = this.data.isLoadSearchData;
    common.searchresult(val, searchId, function (data) {
      var searchlist;
      if (data.data.song.list.length == 0) {
        that.setData({
          noLoadData: true
        })
      }
      isLoadSearchData ? searchlist = data.data.song.list : searchlist = that.data.searchlist.concat(data.data.song.list)
      that.setData({
        searchlist: searchlist,
        searchshow: false,
      })
    })
  },

  /**
   * 打开搜索的音乐
   * */
  openmusic: function (ev) {
    var index = ev.currentTarget.dataset.searchid;
    console.log(index)
    app.globalData.songlist = this.data.searchlist[index];
    var songid = this.data.searchlist[index].songid;
    // 将音乐设置为最近播放
    var latelyPlayMusicList = wx.getStorageSync('latelyPlayMusicList') || [];
    // if (latelyPlayMusicList) {
    //   for (var i = 0, len = latelyPlayMusicList.length; i < len; i++) {
    //     if (latelyPlayMusicList[i].songid == songid) {
    //       latelyPlayMusicList.splice(i, 1)
    //     }
    //   }
    // }
    // latelyPlayMusicList.unshift(this.data.searchlist[index])

    wx.setStorageSync('latelyPlayMusicList', latelyPlayMusicList)
    wx.navigateTo({
      url: '../latelyPlayMusic/latelyPlayMusic'
    })
  },

  /**
   * 切换音乐播放
   * */ 
  Togglesong: function (ev) {
    var off = !this.data.imgpath;
    app.globalData.imgpath = off;
    this.setData({
      imgpath: off
    })
    var songmid = wx.getStorageSync('songmid')
    var strMediaMid = wx.getStorageSync('strMediaMid')


    if (this.data.imgpath == false) {
      console.log(songmid)
      if (strMediaMid) {
        wx.playBackgroundAudio({
          dataUrl: 'http://dl.stream.qqmusic.qq.com/C400' + strMediaMid + '.m4a?guid=2462755174&vkey=891F5BBDD23F53B4A4EB69CA8D4A5A4ABDD3F963F176E1A48916571A75BAB647387EFEA21690EED229EC114697219D176B8265818802AE84&uin=0&fromtag=38'

        })
      } else {
        wx.playBackgroundAudio({
          dataUrl: 'http://dl.stream.qqmusic.qq.com/C400' + songmid + '.m4a?guid=2462755174&vkey=891F5BBDD23F53B4A4EB69CA8D4A5A4ABDD3F963F176E1A48916571A75BAB647387EFEA21690EED229EC114697219D176B8265818802AE84&uin=0&fromtag=38'
        })
      }
    } else {
      wx.pauseBackgroundAudio()
    }
    app.globalData.imgpath = this.data.imgpath;
  },

  /**
   * 打开音乐页面
   * */ 
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
  },
  /**
   * 点击关键字
   * */
  toSearchList: function (e) {
    var searchKey = e.currentTarget.dataset.searchkey;    //关键字
    var searchId = 1;
    var searchHistory = this.data.searchHistory || [];
    console.log(searchHistory)
    searchHistory.unshift(searchKey);
    if (searchHistory.length > 5) {
      searchHistory.pop();
    }
    wx.setStorageSync('searchHistory', searchHistory)
    this.getSearchData(searchKey, searchId)      //获取搜索列表

    this.setData({
      searchKey: searchKey,
      searchHistory: searchHistory,
      showSearchHistory: false
    })
  },
  /**
   * 删除历史搜索单条
   * */
  deleteItem: function (e) {
    var itemKey = e.currentTarget.dataset.itemkey;
    var searchHistory = this.data.searchHistory;
    var newSearchHistory = searchHistory.filter(item => {
      return item != itemKey
    })
    wx.setStorageSync('searchHistory', newSearchHistory)
    this.setData({
      searchHistory: newSearchHistory
    })
  },
  /**
   * 删除所有历史搜索
   * */
  deleteAll: function () {
    console.log(444)
    wx.clearStorageSync('searchHistory');
    wx.showToast({
      title: "成功",
      icon: 'success',
      duration: 1000,
      success: (res) => {
        this.setData({
          searchHistory: ''      //清空
        })
      }
    })
  },
  /**
   * 清除关键字
   * */
  clear_kw: function () {
    this.setData({
      searchKey: '',
      isShowClear: false,
      searchshow: true, //显示热门搜索
      searchlist: [],      //清空搜索数组
      showSearchHistory: true    //显示历史搜索
    })
  }
})
