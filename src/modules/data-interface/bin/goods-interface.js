/**
 * Created by wanghongguang on 16/3/4.
 */
'use strict';

import { getData, postData } from './get-data';

import { host } from './config';

var h5host = host[process.env.NODE_ENV]['h5Host'];

export default {
  goodsDetail,goodsFlashSaleStockLeft,createGoodsOrder,checkUserLimit,getAttrSku
}

//获取商品详情
function goodsDetail(data){
  return getData('app/goods',{
    data:data
  },true);
}

//闪购商品 调用h5接口异步获取总库存
function goodsFlashSaleStockLeft(data){
  var req = [{
    "url": (h5host + '/app/goods/detail?ajax=1&ifRiskCenter=' + data.ifRiskCenter + '&str=' + data.params),
    "method": "get"
  }];
  return postData('ffan/v1/mproxy',{
    data:{
      requests: JSON.stringify(req)
    }
  });
}

//创建订单
function createGoodsOrder(data){

  var totalPrice = 0;
  totalPrice += data.price * data.buyNumber;

  var params = {
    "orderSrc": 2010,
    "paymentFlag": 0,
    memberId: 'memberId',
    productInfos: JSON.stringify(data.productInfos),
    totalPrice: totalPrice,
    tradeCode: data.tradeCode,
    phoneNo: parseInt(data.phoneNo),
    realPay: totalPrice,
    clientInfo: JSON.stringify({
      "clientType": "4",
      "ipAddr": "",
      "clientVersion": "1.0"
    }),
    FFClientType: 1,
    remark: JSON.stringify(data.remark),
    storeId: data.storeId
  };

  return postData('ffan/v4/order',{
    data:params
  });
}

//风控接口
function checkUserLimit(data) {
  return getData('riskcenter/v1/activity/userQualify/check',{
    data: data
  });
}

//获取库存
function getAttrSku(data) {
  return getData('ffan/promotion',{
    data: data
  });
}