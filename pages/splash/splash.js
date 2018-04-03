var requests = require('../../requests/request.js');

Page({
  data: {
    splash: {},
    screenHeight: 0,
    screenWidth: 0
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        });
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    });
  },
  onReady: function () {
    setTimeout(function () {
      console.log(333)
      wx.reLaunch({
        url: '../music/index',
      })
    }, 2000)

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  }
});

/**
 * 跳转到首页
 */
function toIndexPage() {
  setTimeout(function () {
    wx.redirectTo({
      url: '../index/index'
    });
  }, 2000);
}
