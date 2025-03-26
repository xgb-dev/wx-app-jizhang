function time(currentDate) {
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    if (currentDate) {
        timestamp = Date.parse(new Date(currentDate));
    }

    timestamp = timestamp / 1000;
    //console.log("当前时间戳为：" + timestamp);

    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //秒
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //星期
    var W = "星期" + "日一二三四五六".charAt(date.getDay());

    let one, firstDay, firstStr;
    if(currentDate){
        one = currentDate.split('-');
    }else{
        one = (Y + "-" + M + "-" + D).split('-');
    }
    firstDay = one[0] + '-' + one[1] + '-' + '01';
    firstStr = new Date(firstDay);
    //本月第几周
    let NoWeek = Math.ceil((date.getDate() + (firstStr.getDay() - 1)) / 7);
    // if (date.getDate()<7){
    //     if (date.getDay() !== 1) {
    //         NoWeek = '5';
    //     }
    // }
    // 本月第几周
    let M_W = M.toString() + '_' + NoWeek.toString();
    return {
        timestamp: timestamp,
        yyyyMMdd: (Y + "-" + M + "-" + D),
        yyyyMMddhhmmss: (Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s),
        Y: Y,
        M: M,
        D: D,
        W: W,
        M_W: M_W
    }
}
module.exports = {
    data: {
        time
    }
}