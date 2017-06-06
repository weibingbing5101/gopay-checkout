'use strict';

import React from 'react';

const dateFormat = (str) => {
  //TODO：格式化日期控件
  return str
};

class MyTicketItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showCode: {
        display: "none"
      },
      displayRefund: {
        display: "none"
      }
    }
  }

  render() {
    let props = this.props;
    let item = props.data;
    let ticketStatus = props.ticketStatus;
    let validEndTime = dateFormat(item.validEndTime)
    //console.log(ticketStatus)
    if(ticketStatus === '2'){//已过期
      this.state.hideCode = {display: "none"}
    }else{
      this.state.hideCode = {display: "block"}
    }
    if(ticketStatus === '3'){//已退款
      this.state.displayRefund = {display: "block"}
    }else{
      this.state.displayRefund = {display: "none"}
    }

    return(
        <div className="ticket-item">
          <a href="javascript:;">
            <div className="ticket-item-top">
              <p className="ticket-title">{ item.title }</p>
              <p className="effective-date"><i className="iconfont icon-time"></i>有效期至：<span>{ validEndTime }</span></p>
            </div>
            <div className="ticket-item-bottom">
              <p className="ticket-code" style={ this.state.hideCode }><i className="iconfont icon-ticket"></i>取票码：<span className="code">{ item.thirdNo ? item.thirdNo : item.couponNo }</span></p>
            </div>
          </a>
          <div className="ticket-item-info" style={ this.state.displayRefund }>
            <p className="refund"><span className="refund-icon">&yen;</span><span className="refund-cargo">已退货</span></p>
          </div>
        </div>

    )
  }

}

export default MyTicketItem;