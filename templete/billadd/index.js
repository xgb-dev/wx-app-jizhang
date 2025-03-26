// templete/billadd/index.js
let app = getApp();
const inoutListRe = require('./listInOut.js');

const tableList = require('../../utils/table.js');

const date = new Date()
const years = []
const months = []
const days = []
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= (new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate()); i++) {
  days.push(i)
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type: Boolean,
      value: false
    },
    itemid: {
      type: Number,
      value: null
    },
    initData:{ // 初始化数据
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: [],
    tipText: '', // 保存时，错误信息提示
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    current: 0,

    iconList: inoutListRe.data,// icon列表
    option:[{value:'',icon: '',bg: '', checked: true}, {value:'',checked: false}, {value:'',checked: false}, {value:'',checked: false}],// 记账信息

    billType: 'out',// 收支类型
    filter: false,// 页面背景模糊
    inputShow: false,// 数字输入框显示/隐藏

    years,
    months,
    days,
    date:{year: date.getFullYear(),month: new Date().getMonth()+1,day: new Date().getDate()},// 当前日期时间
    value: [years.length-1, new Date().getMonth(), new Date().getDate()-1],//日期时间index
    isDaytime: true,
    openid: ''
  },
  attached() {
    const self = this;
    wx.getStorage({
      key: 'openid', 
      success: function(res){
        self.setData({openid: res.data});
      }
    });
  },
  observers: {
    'initData': function(value) {
      this.renderData();
    }
  },
  ready(){
    this.renderData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    renderData(){
      let data = this.data.initData,
        opt = this.data.option,
        date = this.data.date;
        
      if(JSON.stringify(data) != '{}'){
        opt[0].value = data.text;
        opt[0].icon = data.icon;
        opt[0].bg = data.iconbg;
        opt[1].value = '日期';
        opt[2].value = data.amount;
      
        let yIndex = years.indexOf(data.y);
        date.year = data.y;
        date.month = data.m;
        date.day = data.d;
        this.setData({value: [yIndex, data.m-1, data.d-1], option: opt, billType: data.type,date: date});
      }
    },
    billType(){ // 切换 收/支
      if(this.data.billType == 'in'){
        this.setData({billType: 'out'})
      }else{
        this.setData({billType: 'in'})
      }
    },
    inputFocus(){ // 使输入框被动获焦
      this.setData({inputShow: true});
      const self = this
      let time = setTimeout(() => {
        self.setData({filter: true});
        time = null;
      }, 300);
    },
    back(e){ // 新增帐单页面隐藏
      const self = this;
      let addSave;
      if(e){
        addSave = false
      }else{
        addSave = true
      }
      let time = setTimeout(() => {
        self.triggerEvent('billindexFn',{addSave: addSave, itemData: this.data.initData});
        self.setData({inputShow: true, filter: false});
        time = null;
      },500);
    },
    focus(e){ // 输入框获焦处理
      this.setData({filter: true});
      this.setData({hide: 'hide'});
      let options = this.data.option;
      options.map((val,i) => { options[i].checked = false});
      options[2].checked = true;
      this.setData({option: options});
    },
    blur(){ // 输入框失焦处理
      const self = this;
      setTimeout(() => {
        self.setData({filter: false, inputShow: false});
      }, 500);
    },
    selectOption(e){
      let index = e.currentTarget.dataset.index;
      let options = this.data.option;
      options.map((val,i) => { options[i].checked = false});
      options[index].checked = true;
      this.setData({option: options});
      if(index == 1){
        this.setData({inputShow: false})
      }else if(index == 2){
        this.inputFocus()
      }else{
        this.setData({inputShow: false})
      }
    },
    bindKeyInput(e){
      let opt = this.data.option;
      opt[2].value = e.detail.value
      this.setData({option: opt})
    },
    bindChange(e) {
      const val = e.detail.value
      let month = val[1]+1;
      let days = [];
      for (let i = 1; i <= (new Date(this.data.years[val[0]], month, 0).getDate()); i++) {
        days.push(i)
      }
      this.setData({
        days: days,
        value: val,
        isDaytime: !val[3]
      })
    },
    selectTime(){
      let value = this.data.value;
      let year = this.data.years[value[0]],
          month = this.data.months[value[1]],
          day = this.data.days[value[2]];
      let opt = this.data.option;
      opt[1].value = year+'-'+month+'-'+day;
      this.setData({date: {year: year, month: month, day: day}, option: opt});
      this.inputFocus();
    },
    selectIcon(e){
      let index = e.currentTarget.dataset.index;
      let current = this.data.iconList.listOut[index];
      var opt = this.data.option;
      opt[0] ={value:current.text, icon: current.icon, bg: current.color, checked: true};
      this.setData({option: opt});
    },
    skip(e){
      let index = e.target.dataset.index;
      let opt = this.data.option;
      opt.map((val,i) => { opt[i].checked = false});
      if(index == 0){
        opt[index].value = '其他';
        opt[0].icon = '';
        opt[0].bg = '#333';
      }
      if(index == 1){
        opt[1].value = '今天';
        this.inputFocus();
      }
      let next = Number(index) + 1;
      opt[next].checked = true;
      this.setData({option: opt});
    },
    repair(num){
      if(num && !isNaN(num) && num<10){
        return '0'+num;
      }
      return num
    },
    save(){
      let opt = this.data.option;
      let type = this.data.billType;
      let date = this.data.date;
      let _this = this;
      let data = {
        y: date.year,
        m: date.month,
        d: date.day,
        type: type,
        date: date.year+'-'+_this.repair(date.month)+'-'+_this.repair(date.day),
        amount: opt[2].value,
        icon: opt[0].icon,
        iconbg: opt[0].bg,
        remarks: opt[0].value,
        text:  opt[0].value
      };

      if(!opt[0].value){
        this.setData({tipText: '请选择记账类型'});
        setTimeout(()=>{this.setData({tipText: ''});},1000);
        return false;
      }
      if(!opt[2].value){
        this.setData({tipText: '请输入记账金额'});
        setTimeout(()=>{this.setData({tipText: ''});},1000);
        return false;
      }

      if(this.data.itemid){
        data.id = this.data.itemid;

        // 更新账单明细
        data.create_date = new Date();
        tableList.data.tableBillList
          .where({
            _openid: _this.data.openid,
          })
          .update({
            data: data,
          })
          .then(res => {
            _this.back();
          });
        _this.updateMonthItem(this.data.itemid, data);
      }else{
        // 新增一条账单
        data.create_date = new Date();
        tableList.data.tableBillList
        .add({
          data: data,
        })
        .then(res => {
          // 新增一条年度月账单明细
          _this.updateMonthItem(res._id, data);
          _this.back();
        });
      }
      app.globalData.indexRefresh = true;
    },
    updateMonthItem(itemId, data){
      let _this = this;
      let item = {['m_'+data.m+'_'+data.type]:{[itemId]: Number(data.amount)}};
      tableList.data.tableMonthTotal
      .where({ 
          _openid: _this.data.openid,
      })
      .update({
        data: item
      })
      .then(res =>{
          console.log(res);
      });
    }
  }
})
