const tableList = require('../../utils/table.js');
const tableAccountsTotals = tableList.data.tableAccountsTotals;
const tableMonthTotal = tableList.data.tableMonthTotal;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        filterChange: {
            type: Boolean,
            value: false
        },
        from: {
            type: Object,
            value: {}
        }
    },
    
    attached(){
        
    },
    observers:{
        "show": function(show){
            let _this = this;
            if(show){
                wx.getStorage({
                    key: 'userinfo',
                    success: function (res) {
                        if (res.data) {
                            _this.setData({userinfo: res.data});
                            
                        }
                    }
        
                });
                wx.getStorage({
                    key: 'openid', 
                    success: (res) => {
                        // 查询记帐天数、笔数
                        tableAccountsTotals
                        .where({
                            _openid: res.data,
                        })
                        .get()
                        .then(resTotal => {
                            _this.totals(resTotal.data);
                        });
                        // 查询月度帐单
                        tableMonthTotal
                        .where({ 
                            _openid: res.data,
                            year: new Date().getFullYear(),
                        })
                        .get()
                        .then(resMonth => {
                            let keyIn = 'm_'+(new Date().getMonth()+1)+'_in';
                            let keyOut = 'm_'+(new Date().getMonth()+1)+'_out';
                            
                            console.log(resMonth)
                            let totalIn = Object.values(resMonth.data[0][keyIn]).reduce((a, b) => a + b);
                            let totalOut = Object.values(resMonth.data[0][keyOut]).reduce((a, b) => a + b);
                            console.log(resMonth, totalIn, totalOut)
                            _this.setData({indexData:{in:totalIn, out: totalOut, average: totalIn/new Date().getDate()}});
                        })
                    }
                });
            }
        },
        "from": function(value){
            this.setData({indexData: value.detail});
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        dayTotal: 0,
        billTotal: 0,
        userinfo: {}, // 获取storage的用户信息
        indexData: {}, // 获取首页组件传递过来的信息
        month: (new Date().getMonth())+1, // 当前月
        year: new Date().getFullYear(), // 当前年
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back(){
            this.triggerEvent('personalHide')
        },
        totals(arrayData){
            let arrTransactions = arrayData.map(item => Object.keys(item.transactions).length);
            let arrDays = arrayData.map(item => Object.keys(item.days).length);
         
            let transactions = arrTransactions.reduce((a, b) => a + b);
            let days = arrDays.reduce((a, b) => a + b);
            this.setData({dayTotal: days, billTotal: transactions});
        }
    }
})
