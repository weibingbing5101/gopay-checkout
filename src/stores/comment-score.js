'use strict';

import Reflux from 'reflux';

import CommentAction from '../actions/comment-action';

let CommentStore = Reflux.createStore({

  //监听的action
  listenables: CommentAction,

  /**
   * 初始化
   */
  init(){
  },

  /**
   * 获取门店评分
   */
  getMerchantScore(){
    this.trigger({
      loading:false
    })
  },
  getMerchantScoreCompleted(data){
    this.trigger({
      data:data.data,
      loading:false
    })
  },
  getMerchantScoreFailed(error){
    this.trigger({
      error:error,
      loading:false
    })
  }
});

export default CommentStore;