/**
 * Created by wanghongguang on 16/3/10.
 * 购买按钮
 * 参数：text按钮文案，canBuy是否可购买，goodsDetail商品详情
 */
import React from 'react';

import classNames from 'classnames';

require('./goods-btn.less');

class GoodsButton extends React.Component {
  render() {
    let detail = this.props.goodsDetail;
    let cls = classNames('goods-btn', {'goods-hidden':!detail.goods});
    let clsBtn = classNames('btn-submit', {'btn-disabled':!this.props.canBuy});
    return (
      <div className={cls}>
        <a href="javascript:void(0);" onClick={ this.props.onClick }
            className={clsBtn}>{this.props.text}</a>
      </div>
    )
  }
}

export default GoodsButton;
