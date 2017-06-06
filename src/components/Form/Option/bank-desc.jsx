/**
 * @file 银行信息的option
 */
'use strict';

import React from 'react';
import classNames from 'classnames';
import OptionCommon from './common';

class OptionBankDesc extends OptionCommon {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.iconJson = {
			'中国工商银行':'gongshang',
			'中国农业银行':'zhongnong',
			'中国银行':'zhongguo',
			'中国建设银行':'zhongjian',
			'交通银行':'jiaotong',
			'中信银行':'zhongxin',
			'中国光大银行':'guangda',
			'华夏银行':'huaxia',
			'中国民生银行':'minsheng',
			'广东发展银行':'guangfa',
			'深圳发展银行':'',
			'招商银行':'zhaoshang',
			'兴业银行':'xingye',
			'上海浦东发展银行':'pufa',
			'平安银行':'pingan',
		};
		this.bankCangoryJson = {
			'SAVINGS_DEPOSIT_CARD':' (储蓄卡) ',
			'':'信用卡'
		};
	};

	getLastCardNo(num){
		return num.substring(num.lastIndexOf('*')+1,num.length);
	};
	getIconClassName(key){
		return 
	};

	getChildren(){
		let data = this.props.data;
		let value = this.props.value;
		let icon = this.iconJson[data.bankName];
		let iconClassNams = {
			'list-li-icon': true
		};
		iconClassNams[icon] = true;

		let selectedFlagClassNames = {
			'list-li-select': true,
			'list-li-selected': false
		} 

		return (
			<div>
				<span className= { classNames(iconClassNams) }></span>
				<p className="list-li-name_num">{data.bankName} { this.bankCangoryJson[data.cardType] } { this.getLastCardNo(data.cardNo) }</p>
				<p className="list-li-limitNotify">{data.limitNotify}</p>
				<span className={ classNames(selectedFlagClassNames) }></span>
			</div>
		);
	};

};

export default OptionBankDesc;