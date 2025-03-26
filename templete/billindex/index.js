// templete/billindex/index.js
const app = getApp()
const date = new Date()
const years = []
const months = []
const url = app.globalData.url;

const tableList = require('../../utils/table.js');
const allTime = require('../../utils/time.js');
const getall = require('../../utils/getall.js');
const moment = require('../../utils/moment.js');
const jinrishici = require('../../utils/jinrishici.js');

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: true
        },
        filterChange:{
            type: Boolean,
            value: false
        },
        from: {
            type: Boolean,
            value: false
        }
    },
    
    attached: function() {
        // 在组件实例进入页面节点树时执行
        this.getIndexInfo();
    },
    observers: {
        'from': function (from) { // 监听来自新增保存后，更新首页数据
            console.log(22222222)
            if(from){
                this.refrash();
                console.log(33333333)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        initShow: true,
        loadingBtn: false,
        more: true,
        skip: 0,// 分页截至条数
        itemList: [], // 原始列表
        // 头部时间计算
        nowInfo:{
            date: allTime.data.time().Y+'-'+allTime.data.time().M+'-'+allTime.data.time().D,
            welcomeTimes: (moment().format('HH')<10)?'早上好':(moment().format('HH')>=10 && moment().format('HH')<=12)?'中午好':(moment().format('HH')>12 && moment().format('HH')<=18)?'下午好':'晚上好',
            weather: ''
        },
        show: true,
        
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        years: years,
        year: date.getFullYear(),
        months: months,
        month: allTime.data.time().M,
        
        Y: allTime.data.time().Y,
        D: allTime.data.time().D,
        W: allTime.data.time().W,
        

        accountList: [], // 改造后的列表
        aIN: 0,
        aOUT: 0,

        // 滚动账本
        book: [
            { id: 1, title: '普通账本',checked:true}
          ],
        navScroll: 0,
        scrollTop: 0
    },
    ready: function(){

    },
    /**
     * 组件的方法列表
     */
    methods: {
        brandFn(e){
            let id = e.currentTarget.dataset.id;
            let brand = this.data.brand;
            brand.forEach((item,index,arr) => {
                if (item.id == id){
                    item.checked = true
                } else {
                    item.checked = false
                }
            });
            this.setData({ brand: brand, navScroll: (e.currentTarget.offsetLeft / e.currentTarget.dataset.index * (e.currentTarget.dataset.index - 1))- 50 + 'px'})
        },
        bindscroll(e){
            
        },
        detail(e){
            // 跳转帐单详情
            wx.navigateTo({
              url: '../detail/index?id=' + e.currentTarget.dataset.id,
            });
        },
        jili() {
            let y = Number(allTime.data.time().Y),
                m = Number(allTime.data.time().M),
                d = Number(allTime.data.time().D);
            wx.getStorage({
                key: 'jiliad',
                success: function (res) {
                    if (y > res.data.y || m > res.data.m || (d - res.data.d) >= 3) {
                        setTimeout(function () {
                            let videoAd = null;
                            if (wx.createRewardedVideoAd) {
                                videoAd = wx.createRewardedVideoAd({
                                    adUnitId: 'adunit-eaf3f307d4cd4c69'
                                });
                            }
                            if (videoAd) {
                                videoAd.load()
                                    .then(() => videoAd.show())
                                    .catch(err => console.log(err.errMsg));
                            }
                            wx.setStorage({
                                key: 'jiliad',
                                data: { y: y, m: m, d: d },
                            });
                        }, 3000);
                    } else {
                        return;
                    }
                },
                fail: function (res) {
                    setTimeout(function () {
                        let videoAd = null;
                        if (wx.createRewardedVideoAd) {
                            videoAd = wx.createRewardedVideoAd({
                                adUnitId: 'adunit-eaf3f307d4cd4c69'
                            });
                        }
                        if (videoAd) {
                            videoAd.load()
                                .then(() => videoAd.show())
                                .catch(err => console.log(err.errMsg));
                        }
                        wx.setStorage({
                            key: 'jiliad',
                            data: { y: y, m: m, d: d },
                        });
                    }, 3000);
                }
            })
        },
        repair(num){
            // 补零函数
            if(num && !isNaN(num) && num<10){
              return '0'+num;
            }
            return num
        },
        uniq(array) {
            // 去重函数
            let temp = []; //一个新的临时数组
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            temp.sort((n1,n2) => {return Date.parse(n2) - Date.parse(n1)});
            return temp;
        },
        indexDataFn(){
            console.log('触发了');
        },
        compute(res){
            // 整理计算列表明细
            const self = this;
            let skipOld = self.data.skip;
            if(res.errMsg.split(':')[1] === 'ok'){
                let strIN = 0,
                    strOUT = 0,
                    timeArr = [];
                let dates = new Date();
                let today = dates.getFullYear()+'-'+this.repair((dates.getMonth()+1))+'-'+ this.repair(dates.getDate()),
                    yesterday = dates.getFullYear()+'-'+this.repair((dates.getMonth()+1))+'-'+ this.repair(dates.getDate()-1);
                let newdateold = self.data.itemList.slice();
                let newdate = newdateold.concat(res.data);
                for (let i = 0; i < newdate.length; i++) {
                    timeArr.push(newdate[i].date)
                }
                let time = self.uniq(timeArr);
                let times = [];
                let arrayList = [];
                for (let j = 0; j < time.length; j++) {
                    let ain = 0;let aout = 0;
                    let list = [];
                    let title = Number(time[j].split('-')[0])+'/'+Number(time[j].split('-')[1])+'/'+Number(time[j].split('-')[2]);
                    if(new Date(time[j]) - new Date(today) == 0){
                        title = '今天';
                    }else if(new Date(time[j]) - new Date(yesterday) == 0){
                        title = '昨天';
                    }
                    for (let i = 0; i < newdate.length; i++) {
                        newdate[i].create_time = moment(newdate[i].create_date).format('YYYY-MM-DD HH:mm');
                        if (newdate[i].date == time[j]) {
                            if (newdate[i].type === 'in') {
                                ain += Number(newdate[i].amount)
                            } else if (newdate[i].type === 'out') {
                                aout += -Number(newdate[i].amount)
                            }
                            list.push(newdate[i]);
                        }
                    }
                    arrayList.push({title: title, list:list, in: ain, out: aout});
                }
                if (res.data.length <= 0) {
                    self.setData({ 
                        accountList: arrayList,
                        itemList: newdate, 
                        spinShow: false, 
                        skip: skipOld+res.data.length,
                        more: false,
                        loadingBtn: false
                    });
                } else {
                    self.setData({
                        skip: skipOld+res.data.length,
                        accountList: arrayList,
                        itemList: newdate, 
                        aIN: res.data.amountin,
                        aOUT: res.data.amountout,
                        average: res.data.average,
                        loadingBtn: false,
                        balance: (res.data.amountin - res.data.amountout).toFixed(2),
                        spinShow: false,
                        zIndex: 0
                    });
                    // self.triggerEvent('indexDataFn',{in: res.data.amountin,
                    //     out: res.data.amountout,
                    //     average: res.data.average,});
                }

                self.setData({initShow: false});
            }else{
                self.setData({ initShow: true, loadingBtn: false, more: true,});
            }
        },
        refrash(){
            this.setData({skip: 0, accountList: [], itemList: []});
            this.getIndexInfo();
        },
        getIndexInfo() {
            const self = this;
            let skip = self.data.skip;
            // 查询账单明细
            tableList.data.tableBillList
            .where({ _openid: this.data.openid})
            .orderBy('date', 'desc').skip(skip).get({
                success(res) {
                    self.compute(res)
                }
            });
            // 查询年度月明细金额
            tableList.data.tableMonthTotal
            .where({ 
                _openid: self.data.openid,
                year: new Date().getFullYear()
            })
            .get()
            .then(res => {
                if(res.errMsg.split(':')[1] === 'ok'){
                    if(res.data.length <= 0){
                        // 创建年度月明细表
                        tableList.data.tableMonthTotal
                        .add({ 
                            data:{_openid: self.data.openid,year: new Date().getFullYear()}
                        });
                    }else{
                        const m_key_in = 'm_' + (new Date().getMonth()+1)+'_'+ 'in';
                        const m_key_out = 'm_' + (new Date().getMonth()+1)+'_'+ 'out';
                        let inObject = res.data[0][m_key_in];
                        let outObject = res.data[0][m_key_out];
                        let aIN = 0, aOUT = 0, average = 0;
                        if(inObject){
                            aIN = Object.values(inObject).reduce((a, b) => a+b);
                        }
                        if(outObject){
                            aOUT = Object.values(outObject).reduce((a, b) => a+b);
                            average = aOUT/new Date().getDate();
                        }
                        self.setData({aIN, aOUT, average});
                    }
                }
            });
        },
        // 加载更多
        loadMore(){
            this.getIndexInfo();
            this.setData({loadingBtn: true})
        }
    }
});
