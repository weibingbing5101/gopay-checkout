/**
 * Created by wanghongguang on 16/3/4.
 */
'use strict';

import Reflux from 'reflux';

import GoodsAction from '../actions/goods-action';

let GoodsStore = Reflux.createStore({

  //监听的action
  listenables: GoodsAction,

  /**
   * 初始化
   */
  init(){
    this.goodsDetail={};
    this.goodsPageState={};
    this.flashSaleStockLeft = -1;
  },



  /**
   * 获取商品详情
   */
  getGoodsDetail(){
    this.trigger({
      loading:true
    })
  },
  getGoodsDetailCompleted(data){
    this.goodsDetail=data;
    this.trigger({
      data:this.goodsDetail,
      loading:false
    })
  },
  getGoodsDetailFailed(error){
    this.trigger({
      error:error,
      loading:false
    })
  },

  /**
   * 保存商品页面状态
   */

  saveGoodsPageState(key, val) {
    this.goodsPageState[key] = val;
  },

  /**
   * 获取闪购商品库存
   */
  goodsFlashSaleStockLeft(){
    this.trigger({})
  },
  goodsFlashSaleStockLeftCompleted(data){
    this.goodsDetail=data;
    this.trigger({
      data:this.goodsDetail
    })
  },
  goodsFlashSaleStockLeftFailed(error){
    this.trigger({
      error:error
    })
  }

  /**
   * 创建订单
   */


});

export default GoodsStore;