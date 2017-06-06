/**
 * Created by wanghongguang on 16/3/10.
 * 规格选择框
 */

import React from 'react';

import _ from 'underscore';
import { priceFilter } from '../../modules/tools';

require('./goods-sku-box.less');

class GoodsSkuBox extends React.Component {

  render() {
    let attrList = [];
    if (this.props.skuAttrs.attrs) {
      _.each(this.props.skuAttrs.attrs, function(attr, key1){
        let vals = attr.attrValues, labels = [];
        if (vals) {
          _.each(vals, function(aVal, key2){
            labels.push(<label key={'attr_'+key1+'_'+key2}><input type="radio"
                onChange={ function (e){ this.props.handleSkusSelect(e, attr.id); }.bind(this) }
                checked={this.props.scopeAttr[attr.id]==aVal.id} data-model={this.props.scopeAttr[attr.id]}  name={'r'+attr.id} value={aVal.id} /><span>{aVal.value}</span></label>);
          }.bind(this));
        }
        let oneAttr = (
            <div  key={'attr_group_'+key1} className="selectSort">
              <p className="tit">{attr.name}</p>
              <p className="cont">
              {labels}
              </p>
            </div>
        );
        attrList.push(oneAttr);
      }.bind(this));
    }

    let countReadOnly = false;
    if (!this.props.isFlashSale && !this.props.commonGoods) {
      countReadOnly = true;
    }
    return (
      <div className="sku-menu-box" style={{display: this.props.skuMenuShow && this.props.attrLoadingDone?'':'none'}}>
        <div className="mask">
          <div className="popDiv">
            <a href="javascript://;" onClick={this.props.hideSku} className="closeBt"><i className="iconfont icon-close"></i></a>
            <div className="showInfo">
              <div className="pro"><img src={this.props.img} alt="" className="img-default" /></div>
              <div className="note">
                <p><span className="red">&yen;{priceFilter(this.props.price)}</span>（库存{this.props.stockNum}件）</p>
              </div>
            </div>
            <section>
              {attrList}
              <div className="amount"><span className="buy-amount-title">购买数量</span>
                <span>
                  <a href="javascript:///;" onClick={function(){this.props.changeNumber(-1)}.bind(this)} className={this.props.numberMin==true?'pole':''}><i className="iconfont icon-jian"></i></a>
                  <input type="text" readOnly={countReadOnly} value={this.props.buyNumber} ref="buyNumber" data-model="buyNumber" onChange={ function (e){ this.props.changeHandler(e); }.bind(this) } />
                  <a href="javascript:///;" onClick={function(){this.props.changeNumber(1)}.bind(this)} className={this.props.numberMax==true?'pole':''}><i className="iconfont icon-jia"></i></a>
                </span>
              </div>
            </section>
            <div className="subBtn"><a href="javascript:///" onClick={this.props.gotoConfirm} className={'btn-submit' + (this.props.stockNum <=0 ? ' btn-disabled': '')} >提 交</a></div>
          </div>
        </div>
      </div>
    )
  }
}

export default GoodsSkuBox;

