/**
 * @file loading
 */

'use strict';

import React from 'react';

require('./loading.less');
const url = require('./img/loading.gif');

const Loading = (props) => {
  const style = {
    display:  props.show ? 'block' : 'none'
  }
  return (
    <div className="myF-loading" style={ style } onClick={ props.onClick }>
        <span>
            <img src={ url } /><br />
            <i className="ng-binding">{ props.text }</i>
        </span>
    </div>
  );
};

Loading.defaultProps = {
  text: '数据加载中'
};

export default Loading;