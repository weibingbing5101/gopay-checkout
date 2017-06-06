import React from 'react';


import InfoHd from './InfoHd';
import InfoBd from './InfoBd';

/**
 * eg:商品详情 门店详情
 * 结构:
 * <div class="m-info-box">
 *   <div class="m-info-box-hd">
 *     自定义内容
 *   </div>
 *   <div class="m-info-box-bd"">
 *     自定义内容
 *   </div>
 * </div>
 */

class DetailInfoBox extends React.Component{
  render(){
    let className = this.props.className ? 'm-info-box '+this.props.className : 'm-info-box';
    let style = this.props.style;
    return(
      <div className={ className } style={ style }>
        { this.props.children }
      </div>
    )
  }
}

export default DetailInfoBox