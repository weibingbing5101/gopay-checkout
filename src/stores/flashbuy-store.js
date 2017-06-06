'use strict';

import Reflux from 'reflux';

import FlashbuyAction from '../actions/flashbuy-action';

let FlashbuyStore = Reflux.createStore({
  listenables: FlashbuyAction,

  init(){
    this.screenings=[];
    this.goods=[];
  },

  getScr(){
    this.trigger({
      loading:true,
    });
  },

  getScrCompleted(data){
    if(data.status == 200){
      if(data.data && data.data.length>0){
        this.screenings = data.data;
      }
      this.trigger({
        loading:false,
        screenings:this.screenings,
      });
    }else{
       this.getScrFailed(data.message);
    }
   
  },

  getScrFailed(error){
    this.trigger({
      loading:false,
      error:error,
    });
  },

  getGoods(){
    this.trigger({
      loading:true,
    });
  },

  getGoodsCompleted(data){
    if(data.status == 200){
      this.goods = data.data;
      this.trigger({
        loading:false,
        goods:this.goods,
      });
    }else{
      this.getScrFailed(data.msg);
    }

  },

  getGoodsFailed(error){
    this.trigger({
      loading:false,
      error:error,
    });
  }


  
});

export default FlashbuyStore;