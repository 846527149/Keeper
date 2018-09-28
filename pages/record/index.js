const App = getApp()
import {
  $stopWuxRefresher, $wuxDialog
} from '../../dist/index'
Page({
  data: {
    modeItem: ["全部", "微信", "支付宝", "现金", "银行卡", "信用卡"],
    modeIndex: 0,
    categoryItem: ["全部", "家庭", "饮食", "孩子", "交通", "水果", "汽车", "生活用品", "红包", "水果", "话费", "医疗", "娱乐", "服装", "人情","其它"],
    categoryIndex: 0,
    cycleItem: null,
    billItem: null,
    page: 1,
    limit: 9999
  },
  onLoad() {
    var that = this;
    that.setCycleList();
    var query = wx.createSelectorQuery();
    query.select('.search-bar').boundingClientRect()
    query.select('.footer-bar').boundingClientRect()
    query.exec(function(res) {
      //res就是 该元素的信息 数组
      wx.getSystemInfo({
        success: function(result) {
          var height = result.windowHeight - res[0].height - res[1].height;
          console.log(height)
          that.setData({
            scrollHeight: height
          });
        }
      });
    })
  },
  /**设置周期列表 */
  setCycleList() {
    let that = this;
    App.HttpService.getCycleList()
      .then(res => {
        let data = res.data;
        if (data.IsSuccess) {
          let items = data.Data.Items;
          items.forEach(function(element, index) {
            if (element.Make) {
              that.setData({
                cycleIndex: index
              })
            }
          });
          this.setData({
            cycleItem: items
          })
        }
      }).then(function() {
        that.setBillList();
      })
  },
  /**历史记录 */
  setBillList() {
    let that = this;
    let cycle = that.data.cycleItem[that.data.cycleIndex].Id;
    let category = that.data.categoryItem[that.data.categoryIndex];
    let mode = that.data.modeItem[that.data.modeIndex];
    category = category == "全部" ? "" : category;
    mode = mode == "全部" ? "" : mode;
    console.log(that.data.page)
    App.HttpService.getPagedBillList({
        "cycle": cycle,
        "category": category,
        "mode": mode,
        "page": that.data.page,
        "limit": that.data.limit
      })
      .then(res => {
        let data = res.data;
        if (data.IsSuccess) {
          let items = data.Data.Items;
          let price = 0;
          items.forEach(function(element, index) {
            price = element.Price + price;
            element.BillName = element.BillName + "(" + element.Bill_Begin + "-" + element.Bill_End + ")";
          });
          this.setData({
            billItem: items,
            sumPrice: parseFloat(price).toFixed(2)
          })
        }
      })
  },
  /**支付方式改变 */
  bindModeChange(e) {
    this.setData({
      modeIndex: e.detail.value
    })
    this.setBillList();
  },
  /**类别改变 */
  bindCategoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value
    })
    this.setBillList();
  },
  /**周期改变 */
  bingCycleChange(e) {
    this.setData({
      cycleIndex: e.detail.value
    })
    this.setBillList();
  },
  bindDelete(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    $wuxDialog().confirm({
      resetOnClose: true,
      closable: true,
      title: '提示',
      content: '是否删除该记录？',
      onConfirm(e) {
        let entity = {};
        entity.Id = id;
        App.HttpService.deleteBill(entity).then(res => {
          var data = res.data;
          if (data.IsSuccess) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            that.setBillList();
          } else {
            wx.showToast({
              title: '删除失败' + data.Message,
              icon: '',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**下拉刷新 */
  onRecordRefresh() {
    setTimeout(() => {
      this.setBillList()
      $stopWuxRefresher()
    }, 1000)

  }
})