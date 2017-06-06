/**
 * Created by wanghongguang on 16/3/1.
 * 宽度100%的图片区域
 */

'use strict';

import React from 'react';

require('./base.less');

class ImgBox extends React.Component {
  render() {
    let goto = this.props.href ? this.props.href : 'javascript:///;';
    let style = {display: (this.props.img ? '': 'none')};
    let imgStyle = {display: (this.props.stockLeft >=0 ? '': 'none')};
    return (
      <div className='g-imgBox' style={style}>
        <a href={goto}><img src={this.props.img} alt="" className="default-img" /></a>
        <span className="stockTex" style={imgStyle} >剩余{this.props.stockLeft}件</span>
      </div>
    );
  }
}

ImgBox.defaultProps = {
  img: '',
  href: ''
};

export default ImgBox;
