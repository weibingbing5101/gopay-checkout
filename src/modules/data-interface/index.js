/**
 * @file 数据请求接口
 */

'use strict';

import userInterface from './bin/user-interface';
import orderInterface from './bin/order-interface';
//详情
import detailInterface from './bin/detail-interface';
//评分接口
import commentInterface from './bin/comment-interface';
//乐付相关接口
import flashpayInterface from './bin/flashpay-interface';
//闪购接口
import flashbuyInterface from './bin/flashbuy-interface';
//商品接口
import goodsInterface from './bin/goods-interface';
//支付接口
import payInterface from './bin/pay-interface';

// 果付
import GYUserInterface from './bin/gy-user-interface';


export { userInterface }
export { orderInterface }
export { detailInterface }
export { commentInterface }
export { flashpayInterface }
export { flashbuyInterface }
export { goodsInterface }
export { payInterface }

export { GYUserInterface }

export default {
  userInterface,
  orderInterface,
  detailInterface,
  commentInterface,
  flashpayInterface,
  flashbuyInterface,
  goodsInterface,
  payInterface,


  GYUserInterface
}
