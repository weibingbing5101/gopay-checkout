/**
 * @file 银行信息的option
 */
'use strict';

import React from 'react';
import classNames from 'classnames';
import OptionCommon from './common';

class OptionBankAdd extends OptionCommon {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
	};

	getChildren(){
		let optionsBankClassIcon = classNames('list-li-icon','list-li-icon-add');
		let optionsBankClassWorld = classNames('list-li-name_num', 'list-li-name_num-add');
		let optionsBankClassSelect = classNames('list-li-bank-add', '');

		return (
			<div>
				<span className={ optionsBankClassIcon }></span>
				<p className={ optionsBankClassWorld }>添加银行卡</p>
				<span className={optionsBankClassSelect}></span>
			</div>
		);
	};

};

export default OptionBankAdd;