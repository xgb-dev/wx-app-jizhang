wx.cloud.init();
const db = wx.cloud.database({});
const tableTest = db.collection('test');
const tableUserQs = db.collection('user_qs');

const tableBillList = db.collection('new_bill_list');
const tableMonthTotal = db.collection('year_month_total');
const tableAccountsTotals = db.collection('accounts_totals');

module.exports = {
    data: {
        tableTest,
        tableUserQs,
        tableBillList,
        tableMonthTotal,
        tableAccountsTotals
    }
}