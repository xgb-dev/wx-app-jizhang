//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        }
        else {
            wx.cloud.init({
                traceUser: true,
            })
        }

        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var openid = null;
        var that = this;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: 'https://api.youlaji.com/login',
                    data: { js_code: res.code, wx: true},
                    method:'post',
                    success(res){
                        // that.globalData.openid = res.data;
                        let openid = res.data.openid;
                        wx.removeStorage({
                            key: 'openid',
                            success(res) {
                                wx.setStorage({
                                    key: "openid",
                                    data: openid
                                })
                            }
                        });
                        wx.setStorage({
                            key: "cookie",
                            data: res.data.cookie
                        })
                    }
                })
            }
        })
        
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;
                            wx.getStorage({
                                key: 'openid',
                                success: function(res) {
                                    that.globalData.userInfo.openid = res.data;
                                },
                            })
                            wx.setStorage({
                                key: 'userinfo',
                                data: res.userInfo,
                            })
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (that.userInfoReadyCallback) {
                                that.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    
    globalData: {
        userInfo: null,
        // url:'http://localhost:3000/'
        url:'http://api.youlaiji.com/',
        indexRefresh: false
    }
})