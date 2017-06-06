const ORDER_STATUS = {
  'PAY_TIMEOUT_CLOSE': '付款超时关闭',
  'EXCHANGE_TIMEOUT_CLOSE': '兑换超时关闭',
  'REFUND_CLOSE': '退款关闭',
  'TRADE_SUCCESS': '交易成功',
  'DISSENSION_CLOSE': '纠纷关闭',
  'IN_THE_DISPUTE': '纠纷中',
  'EXCHANGE_SUCCESS': '兑换成功',
  'IN_THE_REFUND': '退款中',
  'PAY_SUCCESS': '付款成功',
  'INITIAL': '待付款',
  'CLOSE': '订单关闭',
  'TRADE_CANCEL': '交易关闭',
  'TRADE_FINISHED': '交易完成',
  'WAIT_CONFIRM': '待确认',
  'DISPATCHING': '配送中',
  'INIT_ORDER': '已下单'
};

/*const ORDER_TYPE = {
  7009: '电影订单',
  7010: '券订单',
  7012: '汉秀订单',
  7013: '实物订单',
  7014: '餐饮订单',
  7015: '乐园订单',
  7030: '乐付订单'
};*/
const ORDER_TYPE = (type) => {
  switch (type){
    case 7009:
      return "电影订单";
    case 7010:
      return "优惠券订单";
    case 7012:
      return "汉秀订单";
    case 7013:
      return "购物订单";
    case 7014:
      return "餐饮订单";
    case 7015:
      return "乐园订单";
    case 7030:
      return "乐付订单";
  }
};

const PROMOTION_TYPE = {
  1: '会员优惠',
  2: '组合优惠'
};

const WeChat ={
  /**
   * 微信支付获取用户授权，scope=snsapi_base 采用静默授权
   * @type {String}
   */
  wxRedirect : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0d5b4c36e7159af0&redirect_uri=' + encodeURIComponent(window.location.origin+'/pay/order/')+'&response_type=code&scope=snsapi_base&',
};

export default {
  ORDER_STATUS,
  ORDER_TYPE,
  WeChat,
}
