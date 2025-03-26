const app = getApp();
const host = app.globalData.url;

function getall(url, data) {
    return new Promise((resolveFn, rejectFn) => {
        
        let openidPro = new Promise( (resolve, reject) => {
            wx.getStorage({
                key: 'openid',
                success: function(res) {
                    resolve(res.data);
                },fail:function(res){
                    reject(res);
                }
            })
        });
        let userinfoPro = new Promise( (resolve, reject) => {
            wx.getStorage({
                key: 'userinfo',
                success: function(res) {
                    resolve(res.data);
                },fail:function(res){
                    reject(res);
                }
            })
        });
        let cookiePro = new Promise( (resolve, reject) => {
            wx.getStorage({
                key: 'cookie',
                success: function(res) {
                    resolve(res.data);
                },
                fail: function(res){
                    reject(res);
                }
            });
        });

        Promise.all([openidPro, userinfoPro, cookiePro]).then((res) => {
            let openid = res[0];
            let postData = {
                openid: res[0],
                nickname: res[1].nickName,
                gender: res[1].gender,
                city: res[1].province+'_'+res[1].city

            };
            
            wx.request({
                url: host + url,
                header: {
                    'content-type': 'application/json; charset=utf-8',
                    'cookie': res[2],
                },
                method: 'post',
                data: Object.assign(data, postData),
                success(res) {
                    //call(openid, res);
                    resolveFn(res);
                }
            });
        }).catch(res => {
            rejectFn(res);
        });
    });
};

module.exports = {
    fn: getall
}