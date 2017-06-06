'use strict';

import React from 'react';
import store from 'store';

import { Tabs, TabPanel } from '../../components/Tabs';
import { MyTicketItem } from '../../components/ItemList';
import InfiniteScroll from '../../components/InfiniteScroll';
import { NoTicketList } from '../../components/NoData';

import CommonAction from '../../actions/common-action'
import OrderAction from '../../actions/order-action';
import OrderStore  from '../../stores/order-store';

import $ from 'jquery';

require("./order-ticket.less");

/**
 * 我的票券
 */

class OrderTicket extends React.Component {

  constructor(props) {
    super(props);
    this.size = 20;
    this.offset = 0;
    this.memberId = true;
    this.ticketStatus = 0;//未使用
    this.ticketData = Array(4).fill([]);
    this.state = {
      hasMore: true,
      ticketList: [],
      noData: false
    }
  }

  componentDidMount() {
    this.unsubscribe = OrderStore.listen(this.onStoreChanged.bind(this));
    this.loadList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChanged(info) {
    if(info.loading!==undefined){
      CommonAction.loading(info.loading);
    }
    if(info.error){
      CommonAction.alert(info.error);
    }else{
      if(info.data){
        let data = info.data.coupons || [];
        let ticketData = this.ticketData[this.ticketStatus];
        //TODO:apply bug loading会闪两次 InfiniteScroll
        //ticketData = data;
        ticketData.push.apply(ticketData, data);
        //console.log(this.state.hasMore + " state改变，触发新一轮渲染");

        this.setState({
          ticketList: ticketData,
          hasMore: data.length >= this.size,
          noData:!data.length
        })

      }
    }
  }

  loadList() {
    let ticketStatus = this.props.ticketStatus[this.ticketStatus];
    if(store.get("ffan_user")){
      OrderAction.getTicketList({
        uid: store.get("ffan_user").uid,
        params: {
          limit: this.size,
          offset: this.offset,
          status: ticketStatus
        }
      })
    }
  }

  createItem() {
    return this.state.ticketList.map( ( item, index ) => {
      return <MyTicketItem key={ index } data={ item } itemKey={ index } ticketStatus={ this.ticketStatus } ></MyTicketItem>
    })
  }

  onTabChange(key) {
    this.ticketStatus = key;
    this.offset = 0;
    this.ticketData[key] = [];
    $('.order-wrap').scrollTop(0);
    this.loadList();
  }

  onScrollLoad() {
    this.offset++;
    this.loadList();
  }

  render() {
    console.log("render list")
    let items = this.createItem();
    return(
        <div>
          <Tabs defaultActiveKey="0" onChange={ this.onTabChange.bind(this) }>
            <TabPanel title="未使用" tabKey="0"></TabPanel>
            <TabPanel title="已使用" tabKey="1"></TabPanel>
            <TabPanel title="已过期" tabKey="2"></TabPanel>
            <TabPanel title="退货退款" tabKey="3"></TabPanel>
          </Tabs>
          <NoTicketList noData={ this.state.noData }></NoTicketList>
          <div style={ {display: !this.state.noData?"block":"none"} }>
            <InfiniteScroll
              className='me-set-order-wrap'
              hasMore={ this.state.hasMore }
              itemHeight={ this.ticketStatus==2?'116':'140' }
              loadMore={ this.onScrollLoad.bind(this) }
              >
              { items }
            </InfiniteScroll>
          </div>

        </div>
    )
  }
}

export default OrderTicket;

OrderTicket.defaultProps = {
  title: '我的票券',
  ticketStatus: [
    3, //未使用
    4, //已使用
    6, //已过期
    12 //退货退款
  ]
};