'use strict';

import React from 'react';

require('./no-order-list.less');

const NoOrderList = (props) => {
  return(
    <div className="m-no-order-list">
      <span className="icon" />
      <div className="text">
        <p>OMG!什么都没有~</p>
        <p>快去购物吧</p>
      </div>
    </div>
  )
};

export default NoOrderList;