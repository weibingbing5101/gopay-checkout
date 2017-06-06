'use strict';

import Reflux from 'reflux';

import FlashpayAction from '../actions/flashpay-action';

let FlashpayStore = Reflux.createStore({

  //������action
  listenables: FlashpayAction,

  /**
   * ��ʼ��
   */
  init(){
    this.userBuy={};
    this.flashpayLists={};
  },

  /**
   * ��ȡ��ǰ�û��Ƿ�����������
   */
  checkUserBuy(){
    this.trigger({
      loading:true
    })
  },
  checkUserBuyCompleted(data){
    //console.log(data)
    this.userBuy=data;
    this.trigger({
      data:this.userBuy,
      loading:false
    })
  },
  checkUserBuyFailed(error){
    this.trigger({
      error:error,
      loading:false
    })
  },

  //��ѯ�ָ��б�
  flashpayList(){
    this.trigger({
      loading:true
    })
  },
  flashpayListCompleted(data){
    this.flashpayLists=data;
    this.trigger({
      data:this.flashpayLists,
      loading:false
    })
  },
  flashpayListFailed(error){
    this.trigger({
      error:error,
      loading:false
    })
  },

  //获取门店乐付规则
  /*getStoreFlashpay(){
    this.trigger()
  },*/
  getStoreFlashpayCompleted(data){
     this.trigger({
       data:data,
       type:'rulesList'
    })
  },
  getStoreFlashpayFailed(error){
    this.trigger({
      error:error,
      type:'rulesList'
    })
  },


  /**
   * 获取门店规则是否可用
   */
  getAllowUseCompleted(data){
    this.trigger({
      data:data,
      type:'rulesAllowUse'
    })
  },
  getAllowUseFailed(error){
    this.trigger({
      error:error,
      type:'rulesAllowUse'
    })
  },
});

export default FlashpayStore;