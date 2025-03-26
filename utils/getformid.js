const tableList = require('./table.js');
const time = require('./time.js');
const app = getApp()
const url = app.globalData.url;
const getformid = options => {
    const form_id = options.formid;
    const text = options.text;
    if (form_id){
        wx.getStorage({
            key: 'openid',
            success: function(res) {
                const openid = res.data;
                let name = '';
                wx.getStorage({
                    key: 'userinfo',
                    success: function(res) {
                        name = res.data.nickName;
                        wx.request({
                            url: url+'notice/',
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: { 
                                'act': 'add', 
                                'nickname': res.data.nickName,
                                'gender': res.data.gender,
                                'city': res.data.province +'_'+ res.data.city,
                                'openid': openid,
                                'formid': form_id,
                                'text': text,
                                'date': time.data.time().yyyyMMddhhmmss
                                },
                            success(res) {
                            }
                        })
                        tableList.data.tableFormId.add({
                            data: { 'form_id': form_id, 'text': text, 'date': time.data.time().yyyyMMddhhmmss, 'nickName': name},
                            success(res){

                            }
                        });
                    }
                })
                
            }
        })
        
    }
}

module.exports = {
    data: getformid
}
