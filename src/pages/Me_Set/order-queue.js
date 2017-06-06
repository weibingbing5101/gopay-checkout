import React from 'react';

import { NoOrderList } from '../../components/NoData';

class OrderQueue extends React.Component {
  constructor(props){
    super(props);
  }

  //TODO:获取数据

  render() {
    return(
      <div>
        <NoOrderList />
      </div>
    )
  }
}

export default OrderQueue;

OrderQueue.defaultProps={
  title: '我的排队'
};