/**
 * Created by wanghongguang on 16/3/10.
 * 商品详情倒计时
 * 参数：goodsState商品所处阶段，promotion促销信息，adId活动id，goodsDetail商品详情
 */
import React from 'react';

import classNames from 'classnames';

require('./goods-countdown.less');

class GoodsCountDown extends React.Component {
  render() {
    let cls = classNames('goods-count-down', {'goods-hidden':!this.props.goodsDetail.goods});
    return (
      <div className={cls}>
        <div className="count-down" style={{display:(this.props.adId && this.props.promotion.promotionType !=1 ?'':'none')}} >
          <i className="iconfont icon-time"></i>
          <countdown>{this.props.clockText}</countdown>
        </div>
        <div className="count-down" style={{display:this.props.adId?'none':''}} >
            {this.props.goodsState}
        </div>
      </div>
    )
  }
}

export default GoodsCountDown;