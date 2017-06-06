/**
 * Created by wanghongguang on 16/3/10.
 * 商品详情页价格
 * 参数：skus商品规格列表, promotion所属活动
 */

import React from 'react';

import classNames from 'classnames';
import _ from 'underscore';

require('./goods-price.less');

class GoodsPrice extends React.Component {
  render() {
    let skus = this.props.skus;
    let originPriceList = _.map(skus, function(sku){ return sku.priceBeforePromotion;});
    let [originMin,originMax] = [_.min(originPriceList), _.max(originPriceList)];
    let originMaxShow = '';
    if (originMax > originMin) {
      originMaxShow = '-' + originMax;
    }
    let cut = this.props.promotion.totalCutAmount;
    cut = cut || 0;
    let [min,max] = [parseFloat(originMin - Number(cut)).toFixed(2).replace(/\.?0*$/,''), parseFloat(originMax - Number(cut)).toFixed(2).replace(/\.?0*$/,'')];
    let maxShow = '';
    if (max > min) {
      maxShow = '-' + max;
    }
    let cls = classNames('goods-price', {'goods-hidden':originPriceList.length <=0});
    return (
      <div className={cls}>
        <em className="">&yen; {min+maxShow}</em>
        <del className="">&yen; {originMin+originMaxShow}</del>
      </div>
    )
  }
}

export default GoodsPrice;
