/**
 * Created by wanghongguang on 16/3/10.
 * 商品详情页中的商品名称
 * 参数：name
 */

import React from 'react';

import classNames from 'classnames';

require('./goods-name.less');

class GoodsName extends React.Component {
  render() {
    let cls = classNames('goods-title-box', {'goods-hidden': !this.props.name});
    return (
      <div className={cls}>
        <dl>
          <dt>{this.props.name}</dt>
          <dd></dd>
        </dl>
      </div>
    )
  }
}

export default GoodsName;