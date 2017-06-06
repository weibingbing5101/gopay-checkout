/**
 * Created by wanghongguang on 16/3/8.
 */
import React from 'react';
import store from 'store';

import { PropTypes } from 'react-router';

import classNames from 'classnames';
import {Link} from 'react-router';

import $ from 'jquery';

require('./success.less');

class PaySuccess extends React.Component{
  constructor(props) {
    super(props);

    this.user = store.get("ffan_user");
    this.cityId=store.get('cityId');
    this.plazaId=store.get('plazaId');

    this.state={
    };

  }

  componentDidMount(){
    $('body').addClass('pay-success-bg');

  }

  componentWillUnmount() {
    $('body').removeClass('pay-success-bg');
  }

  gotoHome(){
    this.context.history.pushState(null, '/flashbuy/'+this.cityId+'/'+this.plazaId);
  }

  gotoOrderList(){
    this.context.history.pushState(null, '/me/order');
  }


  render(){

    return(
      <div className="pay-success-page">
        <div className="smile"></div>
        <div className="success-text">支付成功!</div>
        <div className="bottom"><a href="javascript:///;" onClick={ function(e){ this.gotoOrderList(e); }.bind(this)}>查看订单</a></div>
      </div>
    );
  }

}

PaySuccess.defaultProps = { title: '支付订单' };

PaySuccess.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default PaySuccess;