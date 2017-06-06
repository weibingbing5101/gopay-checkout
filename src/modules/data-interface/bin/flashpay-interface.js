'use strict';

import { getData } from './get-data';

export default {
  checkUserBuy,
  flashpayList,
  getStoreFlashpay,
  getAllowUse
}

//�ж��û��Ƿ����ʹ�õ�ǰ�ָ�����
function checkUserBuy(data){
  return getData('market/v1/flashpay/rules',{
    data:data
  })
}

//�ָ��б�
function flashpayList(data){
  return getData('appsearch/v1/flashpay',{
    data:data
  })
}

//获取门店优惠规则
function getStoreFlashpay(data){
  data.app_version=4000;
  return getData('marketactivity/v2/flashpay/rules',{
    data:data
  })
}

//查询当前用户是否可以用某些规则
function getAllowUse(data){
  data.FFClientVersion = 4000;
  return getData('marketactivity/v2/flashpay/promotion',{
    data:data
  })
}

//  marketactivity/v2/flashpay/promotion?sid=门店ID&uid=会员ID&ddId=设备ID&caller=trade&ids=[优惠规则ID,优惠规则ID]&cash=订单金额