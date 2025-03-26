//index.js
//获取应用实例
const app = getApp()
const date = new Date()
const years = []
const months = []
const url = app.globalData.url;

const tableList = require('../../utils/table.js');
const allTime = require('../../utils/time.js');
const getformid = require('../../utils/getformid.js');
const getall = require('../../utils/getall.js');
const jinrishici = require('../../utils/jinrishici.js')

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

Page({
    data: {
        jia: false,
        rep: false,
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        
        swiperbanner: false, // 授权页面显示控制

        tabbar:[ true, false, false, false, false], // 首页tab栏
        addSave: false,// 新增帐单时，触发首页数据更新
        getIndexData: {}, // 初次加载时把首页组件信息传递给用户中心组件
    },
    welcomeFn(e){
        console.log('来了')
        this.setData({addSave: true});// 授权后先加载首页数据
        setTimeout(()=>{
            this.setData({swiperbanner: false});// 等待500毫秒后去掉，欢迎页面
        },500);
    },
    changeBar(e){
        let sourceTabbar = JSON.parse(JSON.stringify(this.data.tabbar));
        let newTabbar = e.detail.arr;
        let index = e.detail.index;
        let _this = this;
        if(index == 2){

            wx.getStorage({
                key: 'userinfo',
                success: function (res) {
                    if (res.data) {
                        
                    }
                },
                fail: function(res){
                    _this.setData({swiperbanner: true})
                }
    
            });
        }

        var oldPageShow = sourceTabbar.indexOf(true);
        if(newTabbar[2]){
            newTabbar[oldPageShow] = true;
        }
        this.setData({tabbar: newTabbar});
    },
    billindexFn(value){        
        let sourceTabbar = JSON.parse(JSON.stringify(this.data.tabbar));
        sourceTabbar[2] = false;
        this.setData({tabbar: sourceTabbar, addSave: value.detail.addSave})
    },
    catchtouchmove(e){
        // 阻止滚动
    },
    indexDataFn(value){
        console.log(1111)
        this.setData({getIndexData: value})
    },
    onLoad: function (options) {
        jinrishici.load(result => {
            // 下面是处理逻辑示例
            this.setData({ "jinrishici": result.data.content })
        })
        let self = this;
        
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
            wx.setStorage({
                key: 'userinfo',
                data: app.globalData.userInfo,
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    mark: false
                })
                wx.setStorage({
                    key: 'userinfo',
                    data: res.userInfo,
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    wx.setStorage({
                        key: 'userinfo',
                        data: res.userInfo,
                    })
                }
            })
        }
    },
    onShow() {
        if(app.globalData.indexRefresh){ 
            this.setData({ addSave: true});
            app.globalData.indexRefresh = false
        }
        this.setData({ bool: true });
    },
    onShareAppMessage() {

    },
    swiperbanner(e) {
        let self = this;
        self.setData({ swiperbanner: false });
        wx.setStorage({
            key: 'banner',
            data: { banner: true }
        })
    }
});
