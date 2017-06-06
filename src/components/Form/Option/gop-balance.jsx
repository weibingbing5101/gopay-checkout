/**
 * @file 银行信息的option
 */
'use strict';

import React from 'react';
import classNames from 'classnames';
import OptionCommon from './common';

class OptionGopBalance extends OptionCommon {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
	};

	getChildren(){

		return (
			<div>
				果仁余额：100.34
			</div>
		);

	}

};

export default OptionGopBalance;