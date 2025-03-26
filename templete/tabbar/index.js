// templete/tabbar/tabbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value:{
            type: Array,
            value:[]
        }
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
        handleTap(e){
            var index = e.currentTarget.dataset.id;
            
            let ls = this.data.value;
            let p = ls.map((i,val) => { val = false; return val});
            p[index] = true;
            this.triggerEvent('changeBar',{
                index: index,
                arr: p
            });
        }
    }
})
