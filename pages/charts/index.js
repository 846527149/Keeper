var wxCharts = require('../../assets/utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var lineChart = null;
Page({
  data: {
    colorItem: ["#006699", "#33FFFF", "#6600CC", "#663300", "#009966", "#66CCFF", "#990000", "#CCFF33", "#FF9933", "#6699CC", "#999966", "#99FFFF", "#CC9966", "#CCCC66", "#FF33CC", "#FFFFCC", "#FFCCFF"],
    pieChartItem: null,
    lineChartItem: [],
    lineChartCategory:[],
    cycleItem: null,
    width: 320
  },
  onSetPieData() {
    let that = this;
    let cycle = that.data.cycleItem[that.data.cycleIndex].Id;
    app.HttpService.getPieChartsList(cycle)
      .then(res => {
        let data = res.data;
        if (data.IsSuccess) {
          let dataItem = data.Data.Items;
          let result = [];
          for (var i = 0; i < dataItem.length; i++) {
            let entity = {};
            entity.name = dataItem[i].Category;
            entity.data = dataItem[i].Price;
            entity.color = that.data.colorItem[i];
            result.push(entity);
          }
          that.setData({
            pieChartItem: result
          })
        }
      }).then(res => {
        var seriesData = this.data.pieChartItem
        pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'pie',
          series: seriesData,
          width: that.data.width,
          height: 300,
          dataLabel: true,
          dataPointShape: true
        });
      })
  },
  onSetLineData() {
    let that = this;
    app.HttpService.getLineChartsList()
      .then(res => {
        let data = res.data;
        if (data.IsSuccess) {
          let dataItem = data.Data.Items;
          let result =[];
          let category=[];
          for (var i = 0; i < dataItem.length; i++) {
            result.push(dataItem[i].Price);
            category.push(dataItem[i].BillName);
          }
          that.setData({
            lineChartItem: result,
            lineChartCategory: category
          })
          
        }
      }).then(res => {
        lineChart = new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: that.data.lineChartCategory,
          animation: true,
          series: [{
            name: '最近6个月消费',
            data: that.data.lineChartItem,
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '消费金额 (元)',
            min: 1000
          },
          width: that.data.width,
          height:300,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'straight'
          }
        });
      })
  },
  /**设置周期列表 */
  setCycleList() {
    let that = this;
    app.HttpService.getCycleList()
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
        that.onSetPieData();
      })
  },
  /**周期改变 */
  bingCycleChange(e) {
    this.setData({
      cycleIndex: e.detail.value
    })
    this.onSetPieData();
  },
  onLoad: function(e) {
    let that = this;
    try {
      var res = wx.getSystemInfoSync();
      this.data.width = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    this.setCycleList();
    this.onSetLineData();
  },
  createSimulationData: function() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    return {
      categories: categories,
      data: data
    }
  }
});