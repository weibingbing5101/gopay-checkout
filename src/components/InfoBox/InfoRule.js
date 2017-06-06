/**
 * Created by wanghongguang on 16/3/10.
 * 用于商品详情页中的免责声明
 * 参数：detail, 商品详情接口获取的goods_detail，包含attr,goods,goodsPics等结构
 */

import React from 'react';

import { validDateFilter } from '../../modules/tools';

require('./InfoRule.less');


class RuleBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showRuleSum:true
    };
  }

  switchRule() {
    this.setState({
      showRuleSum:!this.state.showRuleSum
    });
  }

  render() {

    let detail = this.props.detail;
    let goods = detail.goods || {};
    let sumStyle = {display: this.state.showRuleSum?'':'none'};
    let detailStyle = {display: this.state.showRuleSum?'none':''};

    let sumBox, detailBox;
    if (goods.unconsumeRefundFlag!=1) {
      let validDayText = '', validDetailText = '', validDayClass = 'groupBox validDay';
      let callBackText = '', callBackDetailText = '', callBackClass = 'iconfont icon-';
      if (goods.useValidType==0) {
        validDayText = ' 自付款成功之日起'+goods.useValidDays+'日内提货有效 ';
        validDetailText = '用户自付款成功之时起'+goods.useValidDays+'日（'+goods.useValidDays+'*24小时）内至门店核销/提货有效；';
      } else if (goods.useValidType==1) {
        validDayClass += ' more-show-dot';
        let timePeriod = validDateFilter(goods.useValidBegin, goods.useValidEnd);
        validDayText = ' 限'+timePeriod+'提货有效 ';
        validDetailText = '用户在'+timePeriod+'至门店核销/提货有效；';
      }
      if (goods.consumedRefundDays && goods.consumedRefundFlag==0) {
        callBackText = ' 提货后'+goods.consumedRefundDays+'日可退 ';
        callBackDetailText = '用户至门店核销提货成功（交易成功）之时起'+goods.consumedRefundDays+'日（'+goods.consumedRefundDays+'*24小时）内可在线提交退货申请， 并须在4日内（4*24小时）至门店返还商品，经商家审核同意确认方可退货；';
        callBackClass += 'complete';
      } else {
        callBackText = ' 提货后不可退 ';
        callBackDetailText = '特殊业态（如餐饮、美妆、大玩家/宝贝王）不支持提货后退款';
        callBackClass += 'remind';
      }
      sumBox = (
          <div className="serviceGroup serviceSum" style={sumStyle} onClick={ function () { this.switchRule(); }.bind(this) } >
            <i className="iconfont icon-down fr"></i>
            <span className={validDayClass}><i className="iconfont icon-shalou"></i>{validDayText}</span>
            <span className="groupBox"><i className="iconfont icon-shizhong"></i> 提货前随时退 </span>
            <span className="groupBox"><i className={callBackClass}></i>{callBackText}</span>
          </div>
      );

      detailBox = (
          <div className="serviceGroup serviceDetail"  style={detailStyle} >
            <dl>
              <dt>
                <i className="iconfont icon-shalou"></i>{validDayText}
              </dt>
              <dd>{validDetailText}</dd>
            </dl>
            <dl>
              <dt>
                <i className="iconfont icon-shizhong"></i> 提货前随时退
              </dt>
              <dd>用户未至门店进行核销/提货前可以随时在线提交退款申请，系统会自动将退款返还至用户账户；如果用户超过核销时效未至门店进行核销/提货也未，系统也会自动将退款返还至用户账户；</dd>
            </dl>
            <dl>
              <dt>
                <i className={callBackClass}></i>{callBackText}
              </dt>
              <dd>{callBackDetailText}</dd>
            </dl>
          </div>
      );
    } else {
      sumBox = (
          <div className="serviceGroup serviceSum" style={sumStyle} onClick={ function () { this.switchRule(); }.bind(this) }>
            <i className="iconfont icon-down fr"></i>
            <span className="groupBox"><i className="iconfont icon-blacklist"></i> 第三方不可退</span>
          </div>
      );
      detailBox = (
          <div className="serviceGroup serviceDetail" style={detailStyle}>
            <dl>
              <dt>
                <i className="iconfont icon-blacklist"></i> 第三方不可退</dt>
              <dd>此为第三方合作商品，提货前后均不可申请退款，具体提货时间请咨询门店；</dd>
            </dl>
          </div>
      );
    }


    return (
        <div className="rule-box"  style={{display:detail.goods?'':'none'}}>
          <section className="detailRules">
          {sumBox}
            <div className="serviceGroup serviceHead" onClick={ function () { this.switchRule(); }.bind(this) } style={detailStyle}>
              <i className="iconfont icon-up fr"></i><span style={{fontSize: '.15rem'}}>服务说明</span>
            </div>
          {detailBox}
          </section>
        </div>
    );
  }
}

export default RuleBox;

