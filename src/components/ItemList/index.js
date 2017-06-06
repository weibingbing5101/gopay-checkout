/**
 * @file 
 */

'use strict';

require('./index.less');

// 所有列表项
import MyTicketItem from './my-ticket-item';//我的-我的票券
import FlashpayListItem from './flashpay-list-item';//乐付列表

export { MyTicketItem }
export { FlashpayListItem }

export default {
	MyTicketItem,
	FlashpayListItem
}