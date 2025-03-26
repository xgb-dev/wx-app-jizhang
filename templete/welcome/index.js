// templete/welcome/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 自定义函数 123
        getUserInfo: function (e) {
            
            if (e.detail.userInfo) {
                app.globalData.userInfo = e.detail.userInfo
                this.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true,
                    mark: false
                });
                wx.setStorage({
                    key: 'userinfo',
                    data: e.detail.userInfo,
                });
                this.triggerEvent('welcomeFn',{
                    swiperbanner: false
                });
            } else {
                this.setData({
                    mark: false
                })
            }
    
        }
    }
})
