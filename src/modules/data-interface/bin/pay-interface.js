/**
 * Created by wanghongguang on 16/3/8.
 */
'use strict';

import { getData, postData } from './get-data';

import { host ,apiSites } from './config';

var h5host = host[process.env.NODE_ENV]['h5Host'];
var apihost = host[process.env.NODE_ENV]['host'];

export default {
  payInSeqNo,
  getSign,
  getOpid
}
//财付通支付跳转
function payInSeqNo (memberId, paySequenceNo, callbackUrl) {
  let payUrl = apihost + "/pay/v2/payUrls";
  let params = {
    channelType: 1, // wap
    partnerId: 108, //支付调用方 108为非凡
    payType: 202, //  TENPAY_WAP  财付通wap支付
    payOrderNos: [paySequenceNo], //订单号数组
    ip: '127.0.0.1',
    memberId: memberId,
    platformId: 105, // TENPAY  财付通,
    callbackUrl: callbackUrl
  };
  console.log(params);
  let _p = [];
  for (let key in params) {
    _p.push(key + "=" + JSON.stringify(params[key]).replace(/^\"|\"$/g, ''));
  }
  let rurl = payUrl + "?" + encodeURI(_p.join("&"));
  let params_r = [{
    "url": rurl,
    "method": "get"
  }];
  return postData('ffan/v1/mproxy', {
    data: {
      requests: JSON.stringify(params_r)
    }
  });
}

function getSign(memberId,openid,paySequenceNo){
  var url =  apiSites.getSign;
  var params = {
      partnerId :116,
      platformId: 107,
      channelType:13,
      ip: '127.0.0.3',
      memberId :true,
      openId  : openid,
      payOrderNos:'['+paySequenceNo+']'
  };

  return getData(url,{data:params});
  
}

function getOpid(code){
  var url = apiSites.getOpid;
  var params = {
      code:   code,
      account: 'ffnewlife'
  };
  
  return postData(url,{data:params});
}



