//获取应用实例
const app = getApp()
const util = require('../../assets/utils/util.js');
import {
  $wuxDialog
} from '../../dist/index'
var _cycleIndex = 0;
Page({
  data: {
    detailed: null,
    price: null,
    cycleIndex: 0,
    categoryItem: ["家庭", "饮食", "孩子", "交通", "水果", "汽车", "生活用品", "红包", "水果", "话费", "医疗", "娱乐", "服装", "人情", "其它"],
    categoryIndex: 0,
    modeItem: ["微信", "支付宝", "现金", "银行卡", "信用卡"],
    modeIndex: 0,
    nowDate: null,
    billItem: null,
  },
  onLoad: function() {
    var that = this;
    that.setCycleList();
    that.setBillList();
    var myDate = new Date()
    that.setData({
      nowDate: util.formatTime(myDate),
      endDate: util.formatTime(myDate),
    })
  },
  /**历史记录 */
  setBillList() {
    let that = this;
    app.HttpService.getPagedBillIndexList({
        "page": 1,
        "limit": 5
      })
      .then(res => {
        let data = res.data;
        if (data.IsSuccess) {
          let items = data.Data.Items;
          items.forEach(function(element, index) {
            element.BillName = element.BillName + "(" + element.Bill_Begin + "-" + element.Bill_End + ")";
          });
          this.setData({
            billItem: items
          })
        }
      })
  },
  /**周期列表 */
  setCycleList() {
    var that = this;
    app.HttpService.getCycleList().then(res => {
      let data = res.data;
      if (data.IsSuccess) {
        let item = data.Data.Items;
        item.forEach(function(element, index) {
          if (element.Make) {
            _cycleIndex = index;
            that.setData({
              cycleIndex: index
            })
          }
        });
        that.setData({
          cycleItem: item
        })
      } else {
        /**获取账单周期失败 */
      }
    });
  },
  onSubmit(e) {
    let that = this;
    let price = e.detail.value.price;
    let detailed = e.detail.value.detailed;
    if (price == "") {
      that.showTopTip("请输入金额")
      return;
    }
    if (price <= 0) {
      that.showTopTip("金额不能为0")
      return;
    }
    if (detailed == "") {
      that.showTopTip("请输入明细")
      return;
    }
    let cycle = that.data.cycleItem[that.data.cycleIndex].Id;
    let category = that.data.categoryItem[that.data.categoryIndex];
    let mode = that.data.modeItem[that.data.modeIndex];
    let recorddate = that.data.nowDate;
    var entity = {};
    entity.Cycle = cycle;
    entity.Category = category;
    entity.Mode = mode;
    entity.Price = price;
    entity.Detailed = detailed;
    entity.RecordDate = new Date(recorddate.replace(/-/g, "-"));
    app.HttpService.createBill(JSON.stringify(entity)).then(res => {
      var data = res.data;
      if (data.IsSuccess) {
        wx.showToast({
          title: '记录成功',
          icon: 'success',
          duration: 2000
        })
        that.setBillList();
        that.setData({
          detailed: null,
          price: null,
          modeIndex: 0,
          categoryIndex: 0,
          nowDate: that.data.endDate,
          cycleIndex: _cycleIndex
        })
      } else {
        that.showTopTip("记录失败" + data.Message);
      }
    })

  },
  bindCycleChange(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      cycleIndex: value
    })
  },
  bindDateChange(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      nowDate: value
    })
  },
  bindModeChange(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      modeIndex: value
    })
  },
  bindCategoryChange(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      categoryIndex: value
    })
  },
  bindDelete(e) {
    var that=this;
    let id = e.currentTarget.dataset.id;
    console.log(id);
    $wuxDialog().confirm({
      resetOnClose: true,
      closable: true,
      title: '提示',
      content: '是否删除该记录？',
      onConfirm(e) {
        let entity={};
        entity.Id = id;
        app.HttpService.deleteBill(entity).then(res => {
          var data = res.data;
          if (data.IsSuccess) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            that.setBillList();
          } else {
            that.showTopTip("'删除失败" + data.Message);
          }
        })
      }
    })
  },
  showTopTip(text) {
    let that = this;
    that.setData({
      showTopTips: true,
      showTopMessage: text
    })
  }
  
})