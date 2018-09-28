import __config from '../etc/config'
import WxResource from '../assets/plugins/wx-resource/lib/index'

class HttpResource {
  constructor(url, paramDefaults, actions, options) {
    Object.assign(this, {
      url,
      paramDefaults,
      actions,
      options,
    })
  }

  /**
   * 返回实例对象
   */
  init() {
    const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
    resource.interceptors.use(this.setInterceptors())
    return resource
  }

  /**
   * 设置请求路径
   */
  setUrl(url) {
    return `${__config.basePath}${url}`
  }

  /**
   * 拦截器
   */
  setInterceptors() {
    return {
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = 'application/json'
        if (wx.getStorageSync('token')) {
          let token = wx.getStorageSync('token');
          let staffid = token.StaffId;
          let timestamp = Date.parse(new Date());
          let nonce = Math.round(Math.random() * 1000);
          let signature = timestamp + "" + nonce + ""+staffid+token.SignToken;
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
        if (response.statusCode === 403) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
        return response
      },
      responseError(responseError) {
        wx.hideLoading()
        return Promise.reject(responseError)
      },
    }
  }
}

export default HttpResource