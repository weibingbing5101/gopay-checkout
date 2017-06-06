/**
 * @file 我的订单
 */

'use strict';

import React from 'react';
import OrderAction from '../../actions/order-action';
import OrderStore from '../../stores/order-store';
import { Link } from 'react-router';

import CommonAction from '../../actions/common-action';
import { MyOrderItem } from '../../components/ItemList';
import InfiniteScroll from '../../components/InfiniteScroll';
import ScrollLoad from '../../components/ScrollLoad'
import { Tabs, TabPanel } from '../../components/Tabs';
import { InfoBox, InfoHd, InfoBd, InfoCont, InfoImg } from '../../components/InfoBox'
import { NoOrderList } from '../../components/NoData';

import { orderConfig } from '../../modules/config';

import $ from 'jquery';

const ORDER_STATUS = orderConfig.ORDER_STATUS;

const TRADE_CODE = {
  LEFU: 7030,
  GOODS: 7010,
  MOVIE: 7009,
  FLASHSALE: 7013
};
const PIC_HOST = 'http://img1.ffan.com/norm_680/';

/**
 * @class 我的订单页面
 */
class Order extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.size = 20;
		this.offset = 0;
		this.page = 0;
		this.memberId = true;
		this.orderStatus = 0;
		this.orderData = [[],[],[]];
		this.state = {
			hasMore: true,
			//scrollTop: 0,
			orderList: [],
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
				let data = info.data.data.orderInfos||[];
				let orderData = this.orderData[this.orderStatus];
				orderData.push.apply(orderData, data);

				this.setState({
					orderList: orderData,
					hasMore: data.length >= this.size,
					noData: data.length == 0 && this.offset==0
					//scrollTop: this.orderStatus
				})
			}
		}
	}

	loadList(){
		let orderStatus = this.props.orderStatus[this.orderStatus];
		OrderAction.getOrderList({
			size: this.size,
			offset: this.offset,
			memberId: this.memberId,
			orderStatus: orderStatus
		});
	}

	onTabChange(key){
		this.orderStatus = key;
		this.offset = 0;
		this.page = 0;
		this.orderData[key] = [];
		$('.me-set-order-wrap').scrollTop(0);
		/*this.setState({
			orderList: []
		})*/
		this.loadList();
	}

	onScollLoad(){
		this.offset = this.page * this.size;
		this.page ++ ;
		this.loadList();
	}

	createItems(){
		return this.state.orderList.map( ( item, index ) => {
      var orderTitle = '',
          orderPic = '',
				  productPrice = 0,
				  linkTo = '/me/orderDetail/' + item.orderNo;
      switch (item.orderCode){
        case TRADE_CODE.LEFU:
          orderTitle = item.storeName;
          orderPic = item.storePic;
					productPrice = item.realPayAmt;
          break;
        case TRADE_CODE.GOODS:
        case TRADE_CODE.MOVIE:
        case TRADE_CODE.FLASHSALE:
          orderTitle = item.productList[0].title;
          orderPic = item.productList[0].picture;
					productPrice = item.productList[0].productPrice;
          break;
        default:
          break;
      }
      return (
        <InfoBox key={ index }>
					<Link to={ linkTo }>
						<InfoHd>
							<InfoImg src={ PIC_HOST+orderPic } imgDefault=""/>
							<InfoCont>
								<div className="order-info-cont">
									<p className="tit-main">{ orderTitle }</p>
									<p className="tit-sec">
										<span>单价 &yen;{ productPrice }</span>
										<i>|</i>
										<span>数量 { item.productList.length || 1 }张</span>
										<i>|</i>
										<span>总价 &yen;{ item.realPayAmt }</span>
									</p>
								</div>
							</InfoCont>
						</InfoHd>
						<InfoBd>
							<div className="order-info-bt">
								<span>订单编号 { item.orderNo }</span>
								{(() => {
									let status = item.orderStatus;
									let statusClass = 'trade-status ';
									if(status.indexOf('FINISHED')>=0 || status.indexOf('INITIAL')>=0){
										statusClass += 'm-font-green'
									}else if(status.indexOf('SUCCESS')>=0){
										statusClass += 'm-font-red'
									}
									return(
										<span className={ statusClass }>{ ORDER_STATUS[item.orderStatus]||'' }</span>
									)
								})()}
							</div>
						</InfoBd>
					</Link>
        </InfoBox>
        )
    });
	}

	render() {
		let items = this.createItems();
		return (
			<div>
				<Tabs defaultActiveKey="0" onChange={ this.onTabChange.bind(this) }>
			    <TabPanel title="全部" tabKey="0"/>
			    <TabPanel title="待付款" tabKey="1"/>
			    <TabPanel title="已付款" tabKey="2"/>
			  </Tabs>
				{(() => {
					switch (this.state.noData) {
						case true: return (
							<NoOrderList />
						);
						default: return (
							<InfiniteScroll
								hasMore={ this.state.hasMore }
								loadMore={ this.onScollLoad.bind(this) }
								className='me-set-order-wrap'
								itemHeight='112'
							>
								{ items }
							</InfiniteScroll>
						);
					}
				})()}

			</div>
		);
	}
}

/*
* <MyOrderItem key={ index } data={ item } itemKey={ index } />
* */

Order.defaultProps = { 
	title: '我的订单',
	orderStatus: [
		'', //全部
		'["INITIAL"]', //待付款
		'["TRADE_FINISHED","PAY_SUCCESS","TRADE_SUCCESS"]', //已付款
	]
};

export default Order;