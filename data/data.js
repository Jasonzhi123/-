/**
 * 轮播图
 * */
function slider(callback) {
  wx.request({
    url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', //仅为示例，并非真实的接口地址
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1503061253221
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res.data)
    }
  })
}

function topList(callback) {
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg', //仅为示例，并非真实的接口地址
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1503061253221
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res.data)
    }
  })
}
/**
 * 搜索
 * */
function search(callback) {
  wx.request({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg', //仅为示例，并非真实的接口地址
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1503055987379
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        //成功了
        callback(res.data);
      }
    }
  })
};

function toplist_detailed(id, callback) {
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      tpl: 3,
      page: 'detail',
      type: 'top',
      topid: id,
      _: 1503243896230
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        //成功了
        callback(res.data);
      }
    }
  })
};
/**
 * 歌词
 * */
function getLyric(id, callback) {
  wx.request({
    url: 'https://route.showapi.com/213-2',
    data: {
      musicid: id,
      showapi_appid: '23654',
      showapi_timestamp: new Date().getTime(),
      showapi_sign: 'd23793312daf46ad88a06294772b7aac'
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  });
};
/**
 * 搜索结果
 * */
function searchresult(val, id, callback) {
  wx.request({
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', //仅为示例，并非真实的接口地址
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: val,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf - 8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      p: id,
      _: new Date().getTime()
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        //成功了
        callback(res.data);
        console.log(res.data)
      }
    }
  })
};

/**
 * 电台
 * */
function radioStation() {
  wx.request({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_musiclist_getmyfav.fcg', //仅为示例，并非真实的接口地址
    data: {
      g_tk: 1309251955,
      songid: 201585777,
      songtype: 13,
      jsonpCallback: 'jsonp2',
      _: new Date().getTime()
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      // if (res.statusCode == 200) {
      //   //成功了
      //   callback(res.data);
      //   console.log(res.data)
      // }
    }
  })
};

/**
 * 热歌
 * */
function hotSong() {
  wx.request({
    url: 'https://c.y.qq.com/portalcgi/fcgi-bin/music_mini_portal/fcg_getuser_infoEx.fcg',
    data: {
      g_tk: 1309251955,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      source: 4001,
      _: new Date().getTime()
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      // if (res.statusCode == 200) {
      //   //成功了
      //   callback(res.data);
      //   console.log(res.data)
      // }
    }
  })
};

/**
 * vkey
 * */
function vkey(songmid,filename,callback) {
  console.log(filename)
  console.log(songmid)
  wx.request({
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    data: {
      g_tk: 195219765,
      jsonpCallback: 'MusicJsonCallback004680169373158849',
      loginUin: '', //可以传空值  
      hostUin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0,
      cid: 205361747,
      // callback: 'MusicJsonCallback004680169373158849',
      uin:0, //可以传空值  
      songmid: songmid,
      filename: filename,
      guid: 9918820956,
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data)
      var data = res.data;
      var vkey = data.data.items[0].vkey
      callback(vkey);
      
    }
  })
}

module.exports = {
  slider: slider,
  topList: topList,
  vkey: vkey,
  search: search,
  toplist_detailed: toplist_detailed,
  getLyric: getLyric,
  hotSong: hotSong,
  radioStation: radioStation,
  searchresult: searchresult
}