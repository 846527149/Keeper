import WxRequest from '../assets/plugins/wx-request/lib/index'

class HttpService extends WxRequest {
  constructor(options) {
    super(options)
    this.$$prefix = ''
    this.$$path = {
      cyclelist        :"List/CycleList",
      createbill       :"Create/CreateBill",
      billpaged        :'Paged/BillPagedList',
      billindexpaged   :'Paged/BillIndexPagedList',
      deletebill       :"Delete/DeleteBill",
      piechartlist     :"List/PieChartsList",
      linechartlist    :"List/LineChartsList"
    }
    this.interceptors.use({
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = 'application/json'
        if (wx.getStorageSync('token')) {
          let token = wx.getStorageSync('token');
          let staffid = token.StaffId;
          let timestamp = Date.parse(new Date());
          let nonce = Math.round(Math.random() * 1000);
          let signature = timestamp +""+ nonce +""+ staffid + token.SignToken;
          request.header["staffid"] = staffid;
          request.header["timestamp"] = timestamp;
          request.header["nonce"] = nonce;
          request.header["signature"] = signature;
        }
        wx.showLoading({
          title: '加载中',
        })
        return request
      },
      requestError(requestError) {
        wx.hideLoading()
        return Promise.reject(requestError)
      },
      response(response) {
        wx.hideLoading()
        if (response.statusCode === 401 || response.statusCode === 403) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
        return response
      },
      responseError(responseError) {
        wx.hideLoading()
        if (responseError.statusCode === 401 || responseError.statusCode === 403) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
        return Promise.reject(responseError)
      },
    })
  }
  /**获取账单周期列表 */
  getCycleList() {
    return this.getRequest(this.$$path.cyclelist,null)
  }
  /**创建记录 */
  createBill(params){
      return this.postRequest(this.$$path.createbill, {
        data: params,
      })
  }
  /**记录列表分页 */
  getPagedBillList(params) {
    return this.getRequest(this.$$path.billpaged, {
      data: params,
    })
  }
  /**最近6月趋势图 */
  getLineChartsList() {
    return this.getRequest(this.$$path.linechartlist, null)
  }
  /**获取周期分类图标数据 */
  getPieChartsList(cycle) {
    return this.getRequest(this.$$path.piechartlist, {
      data:{Cycle:cycle}
    })
  }
  /**首页记录列表分页 */
  getPagedBillIndexList(params) {
    return this.getRequest(this.$$path.billindexpaged, {
      data: params,
    })
  }
  /**删除记录 */
  deleteBill(params){
    return this.postRequest(this.$$path.deletebill, {
      data: JSON.stringify(params),
    })
  }
  /**
   * 更新客户信息
   */
  updateCustomerInfo(params){
    return this.postRequest(this.$$path.updatecustomer, {
      data: JSON.stringify(params),
    })
  }
 
}

export default HttpService