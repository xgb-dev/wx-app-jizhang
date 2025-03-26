// pages/detail/index.js
const getall = require('../../utils/getall.js');
const moment = require('../../utils/moment.js');
const tableList = require('../../utils/table.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        addTemplete: false, // 控制编辑组件显示隐藏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        const self = this;
        tableList.data.tableUserInfo
          .where({
            _id: options.id,
          })
          .get()
          .then(res => {
            self.setData({info: res.data[0]});
          });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (options) {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    handleClick(e) {
        let self = this;
        let index = e.detail.index;
        if(index==0){
            let data = { id: this.data.obj.id, checked: true, act: 'ispay', hisamount: this.data.obj.amount, amount: this.data.obj.amount - this.data.obj.allamount }
            if (data.id) {
                getall.fn('bills/', data, function (openid, res) {
                    let obj = self.data.obj;
                    obj.amount = Number(res.data.amount).toFixed(2);
                    obj.hisprice = res.data.hisprice;
                    obj.payment = res.data.payment;

                    self.setData({ checked: true, color: 'default', obj: obj, visible: false  })
                });
            }
        }
    }, 
    addTempleteFn(){
        
        this.setData({addTemplete: true});
    },
    back(){
        wx.navigateBack({
            
        })
    },
    billindexFn(value){
        let data = value.detail.itemData,
            info = this.data.info;
        for(let key in data){
            info[key] = data[key]
        }
        this.setData({addTemplete: false, info: info});
    }

})