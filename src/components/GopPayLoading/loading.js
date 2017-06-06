/**
 * @file loading
 */

'use strict';

import React from 'react';

require('./loading.less');
const url = require('./img/loading.gif');

const GopPayLoading = (props) => {
  const style = {
    display:  props.isGyLoadingShow ? 'block' : 'none'
  }
  return (
    <div className="gy-loading" style={ style } onClick={ props.onClick }>
        <span>
            <img src={ url } /><br />
            <i className="ng-binding">{ props.gyLoadingTxt }</i>
        </span>
    </div>
  );
};

GopPayLoading.defaultProps = {
};

export default GopPayLoading;