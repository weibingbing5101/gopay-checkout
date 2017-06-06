/**
 * Created by dell on 2016-2-1.
 */
'use strict';

import Reflux from 'reflux';

import DetailAction from '../actions/detail-action';

let DetailStore = Reflux.createStore({

  //监听的action
  listenables: DetailAction,

  /**
   * 初始化
   */
  init(){
    this.merchantDetail={};
    this.merchantIntroduction={}
  },

  /**
   * 获取门店详情
   */
  getMerchantDetail(){
    this.trigger({
      loading:true
    })
  },
  getMerchantDetailCompleted(data){
    //console.log(data)
    this.merchantDetail=data;
    this.trigger({
      data:this.merchantDetail,
      loading:false
    })
  },
  getMerchantDetailFailed(error){
    this.trigger({
      error:error,
      loading:false
    })
  },

  /**
   * 获取门店图文详情
   */
  getMerchantIntroduction(){
    this.trigger({
      loading:true
    })
  },
  getMerchantIntroductionCompleted(data){
    this.merchantIntroduction=data;
    this.trigger({
      data:this.merchantIntroduction,
      loading:false
    })
  },
  getMerchantIntroductionFailed(data){
    this.trigger({
      error:error,
      loading:false
    })
  }
});

export default DetailStore;