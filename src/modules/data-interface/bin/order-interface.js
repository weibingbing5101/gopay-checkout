/**
 * @file 订单相关接口
 */

'use strict';

import { getData, postData, putData } from './get-data';
import $ from 'jquery';
import cookieObj from '../../cookie';

const cookie = cookieObj.cookie;

export default {
	orderList,
	ticketList,
	orderDetail,
	orderMovieDetail,
	orderCouponCode,
	orderPickupCode,
  commonClock,
  createOrder
}

function createOrder(arg, user) {
  
  arg = arg||{};

  let remark = arg.remark||{},
      buyNumber = arg.buyNumber,
      memberId = user.uid,
      phoneNo = parseInt(user.member.mobile),
      pLoginToken = cookie('ploginToken'),
      price = arg.price,
      totalPrice,
      realPay,
      noPreferentialPrice = arg.noPreferentialPrice,
      orderData;

  // 总价格逻辑
  if(arg.totalPrice!==undefined){
    totalPrice = arg.totalPrice;
  }else if(price!==undefined){
    totalPrice = price*buyNumber;
  }

  // 实付金额逻辑
  if(arg.realPay!==undefined){
    realPay = arg.realPay;
  }else if(price!==undefined){
    realPay = price*buyNumber;
  }

  orderData = {
    orderSrc: 2010,
    paymentFlag: 0,
    memberId: true,
    totalPrice: totalPrice,
    noPreferentialPrice: noPreferentialPrice,
    tradeCode: arg.tradeCode,
    phoneNo: phoneNo,
    realPay: realPay,
    clientInfo: JSON.stringify({
      "clientType": "4",
      "ipAddr": "",
      "clientVersion": "1.0"
    }),
    FFClientVersion: 40000,
    FFClientType: 1,
    remark: JSON.stringify(remark),
    storeId: arg.storeId,
    devInfo: JSON.stringify(arg.devInfo||{}),
    ddId: 'xxx',
  };

  if(arg.promotionInfos){
    orderData.promotionInfos = JSON.stringify(arg.promotionInfos);
  }

  return postData('ffan/v4/order', {
      data: orderData,
      //xhrFields: { withCredentials: true}
  });

};

function buildTestData(data, num){
	num=num||2;
	var arr=[];
	for(var i=0;i<num;i++){
		arr = arr.concat(data.slice(0));
	}
	return arr;
}

/**
 * @method orderList
 * @desc 获取订单列表
 * @param data.memberId {String} 会员ID
 * @param data.tradeCodes {String} 交易类型
 * @param data.orderStatus {String} 订单状态
 * @param data.tradeSrc {String} 订单来源
 * @param data.offset {Int} 起始位置
 * @param data.size {Int} 获取条数
 * @returns {*}
 */
function orderList(data) {

		/*var deferred = $.Deferred();
		data = {"data":{"orderInfos":[{"bizId":"10001","createTime":1451441160,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017931","offlineBankCardPaymentList":[],"orderAmt":"122","orderCode":7009,"orderCreateTime":1451441160,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10232094612825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10232094612825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10232094612825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","payInfoPos":[],"paySequenceNo":"20151230100559663965","payTime":0,"plazaId":"1100079","presentCouponList":[],"productList":[{"merchantId":"10017931","orderNo":"10232094612825","picture":"h0059b358187c145cd321d99ed1f5b50a1b","plazaId":"1100079","productCode":"7009","productCount":1,"productId":"867905_8230","productInfo":"{\"priceBeforePromotion\":\"60.00\",\"spacId\":\"867905_8230\",\"pic\":\"h0059b358187c145cd321d99ed1f5b50a1b\",\"date\":\"2015-12-30 18:20:00\",\"tradeCode\":\"7009\",\"timestamp\":1451470800,\"parentId\":\"\",\"title\":\"\u5bfb\u9f99\u8bc0\",\"price\":\"61.00\",\"seat\":\"7\u63924\u5ea7\",\"operateCutAmount\":\"0\",\"systemServiceFee\":\"1.00\",\"place\":\"\u5317\u4eac\u7ea2\u661f\u592a\u5e73\u6d0b\u7535\u5f71\u57ce-4\u53f7\u5385\",\"merchantCutAmount\":\"0\",\"filmNo\":\"1441955573047\"}","productPrice":"61","storeId":"10012203","storeName":"\u7ea2\u661f\u592a\u5e73\u6d0b\u5f71\u57ce\uff08\u5317\u4eac\u7231\u7434\u6d77\u5e97\uff09","storePic":"T10FYTByYT1RCvBVdK","title":"\u5bfb\u9f99\u8bc0"},{"merchantId":"10017931","orderNo":"10232094612825","picture":"h0059b358187c145cd321d99ed1f5b50a1b","plazaId":"1100079","productCode":"7009","productCount":1,"productId":"867905_8091","productInfo":"{\"priceBeforePromotion\":\"60.00\",\"spacId\":\"867905_8091\",\"pic\":\"h0059b358187c145cd321d99ed1f5b50a1b\",\"date\":\"2015-12-30 18:20:00\",\"tradeCode\":\"7009\",\"timestamp\":1451470800,\"parentId\":\"\",\"title\":\"\u5bfb\u9f99\u8bc0\",\"price\":\"61.00\",\"seat\":\"2\u63925\u5ea7\",\"operateCutAmount\":\"0\",\"systemServiceFee\":\"1.00\",\"place\":\"\u5317\u4eac\u7ea2\u661f\u592a\u5e73\u6d0b\u7535\u5f71\u57ce-4\u53f7\u5385\",\"merchantCutAmount\":\"0\",\"filmNo\":\"1441955573047\"}","productPrice":"61","storeId":"10012203","storeName":"\u7ea2\u661f\u592a\u5e73\u6d0b\u5f71\u57ce\uff08\u5317\u4eac\u7231\u7434\u6d77\u5e97\uff09","storePic":"T10FYTByYT1RCvBVdK","title":"\u5bfb\u9f99\u8bc0"}],"realPayAmt":"122","remark":"{\"orderType\":\"movie\",\"flashSale\":1}","returnPoint":"0","storeId":"10012203","storeName":"\u7ea2\u661f\u592a\u5e73\u6d0b\u5f71\u57ce\uff08\u5317\u4eac\u7231\u7434\u6d77\u5e97\uff09","storePic":"T10FYTByYT1RCvBVdK","thirdOrderNo":"144116718556","updateTime":1451442004,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":""},{"bizId":"10001","createTime":1451012928,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"100","orderCode":7030,"orderCreateTime":1451012928,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223771982825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223771982825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223771982825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","payInfoPos":[],"paySequenceNo":"20151225110848275187","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"100","remark":"{\"orderType\":\"lefu\"}","returnPoint":"1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451013174,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012915,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"123","orderCode":7030,"orderCreateTime":1451012915,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223769922825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223769922825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223769922825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012915000,"giftsType":0,"id":10228,"orderNo":"10223769922825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012915000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110836275050","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"119","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"1.23","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451013159,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012910,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"123","orderCode":7030,"orderCreateTime":1451012910,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223769312825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223769312825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223769312825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012910000,"giftsType":0,"id":10227,"orderNo":"10223769312825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012910000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110830275001","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"119","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"1.23","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451013156,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012905,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"909090","orderCode":7030,"orderCreateTime":1451012905,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223768782825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223768782825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223768782825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012905000,"giftsType":0,"id":10226,"orderNo":"10223768782825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012905000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110825274969","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"909086","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"9090.9","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451013151,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"bizId":"10001","createTime":1451012486,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"100","orderCode":7030,"orderCreateTime":1451012486,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223679522825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223679522825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223679522825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","payInfoPos":[],"paySequenceNo":"20151225110126266580","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"100","remark":"{\"orderType\":\"lefu\"}","returnPoint":"1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451012731,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012468,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"10","orderCode":7030,"orderCreateTime":1451012468,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223669112825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223669112825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223669112825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012468000,"giftsType":0,"id":10225,"orderNo":"10223669112825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012468000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110109259760","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"6","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"0.1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451012713,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012440,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"10","orderCode":7030,"orderCreateTime":1451012440,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223641882825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223641882825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223641882825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012440000,"giftsType":0,"id":10224,"orderNo":"10223641882825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012440000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110041263580","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"6","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"0.1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451012684,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"adId":"14","bizId":"10001","createTime":1451012432,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"100","orderCode":7030,"orderCreateTime":1451012432,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223633292825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223633292825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223633292825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","orderTradePromotionList":[{"createTime":1451012432000,"giftsType":0,"id":10223,"orderNo":"10223633292825","promotionAmount":"4","promotionDesc":"<p>1\u3001\u6d3b\u52a8\u65f6\u95f4\uff1a\u81ea12\u670811\u65e5\u8d77\u81f312\u670831\u65e5\u6b62\uff1b<\/p><p>2\u3001\u6d3b\u52a8\u671f\u95f4\u6bcf\u4f4d\u7528\u6237\u6bcf\u5929\u53ef\u4eab\u53d73\u6b21\u4e70\u5355\u4f18\u60e0\uff0c\u6d3b\u52a8\u671f\u95f4\u53ef\u4eab\u53d74\u6b21\u4e70\u5355\u4f18\u60e0\uff1b<\/p>","promotionId":"22","promotionType":1,"sourceId":0,"updateTime":1451012432000,"usedTimes":1,"version":0}],"payInfoPos":[],"paySequenceNo":"20151225110033259115","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"96","remark":"{\"ffanSubsidyCash\":\"0.00\",\"merchantContractId\":\"125536\",\"orderType\":\"lefu\",\"oaCode\":\"\",\"merchantSubsidyCash\":\"4.00\",\"merchantSubsidyCashList\":\"[{\\\"subsidyCash\\\":\\\"4.00\\\",\\\"isThirdParty\\\":\\\"0\\\",\\\"subsidyMerchant\\\":\\\"10003\\\"}]\"}","returnPoint":"1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451012676,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"},{"bizId":"10001","createTime":1451012424,"deleteFlag":0,"memberId":"15000000003902825","merchantId":"10017431","offlineBankCardPaymentList":[],"orderAmt":"10","orderCode":7030,"orderCreateTime":1451012424,"orderDetailVo":{"appointmentTime":0,"freight":"0","orderNo":"10223624112825","packingCharge":"0","phoneNo":"18611682011"},"orderMark":{"applyRefundFlag":0,"auditRefundFailFlag":0,"auditRefundSuccessFlag":0,"createTicketFlag":0,"financeProjectFailFlag":0,"orderNo":"10223624112825","payFlag":0,"payTimeoutFlag":1,"paymentFlag":0,"refundFlag":0,"returnPointFlag":0,"useCouponFlag":0,"usePointFlag":0},"orderNo":"10223624112825","orderSrc":2010,"orderStatus":"TRADE_CANCEL","payInfoPos":[],"paySequenceNo":"20151225110025262149","payTime":0,"plazaId":"1100387","presentCouponList":[],"productList":[],"realPayAmt":"10","remark":"{\"orderType\":\"lefu\"}","returnPoint":"0.1","storeId":"10011669","storeName":"QA\u7ebf\u4e0a\u6d4b\u8bd5\u7528\u9910\u996e\u95e8\u5e972","storePic":"T1MXdTBg_T1RCvBVdK","updateTime":1451012671,"useCouponList":[],"usePoint":"0","usePointDiscount":"0","version":2,"commentStatus":0,"orderButtonDesc":"repay"}],"totalSize":29},"status":200,"msg":"\u6210\u529f"}
		data = data.data;
		data.orderInfos = buildTestData(data.orderInfos);
		console.log(data.orderInfos.length)
		deferred.resolve(data);
		return deferred.promise();*/


    return getData('ffan/v1/orderlistMoreinfo', {
        data: data
    });
};

/**
 * @method ticketList
 * 获取票券列表
 * @param data.status 订单状态
 * @param data.offset 起始位置
 * @param data.limit 每页条数
 * @param memberId
 * @returns {*}
 */
function ticketList(data) {
	var memberId = data.uid;
	return getData('coupon/v1/members/' + memberId + '/coupons', {
		data: data.params
	})
}

/**
 * 订单详情
 * @param orderId
 * @returns {*}
 */
function orderDetail(data) {
  return getData('trade/orders/' + data.orderId)
}

/**
 * 订单详情-电影票券码
 */
function orderMovieDetail(data) {
	return getData('film/v2/trade/ticketInfo',{
		data: data
	})
}

/**
 * 订单详情-券 券码
 * @returns {*}
 */
function orderCouponCode(data) {
	return getData('coupon/v1/order/' + data.orderNo + '/coupons')
}

/**
 * 订单详情-实物提货吗
 * @returns {*}
 */
function orderPickupCode(data) {
	return getData('pickup/v1/pickupCode/' + data.orderNo )
}

/**
* 订单相关事件
* */
function commonClock(data) {
  return getData('ffan/v4/commonClock',{data:data});
}