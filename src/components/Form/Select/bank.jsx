'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonSelect from './common';

//验证码输入框
class SelectBank extends CommonSelect {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
	};	
};




SelectBank.defaultProps = {
	optionTitle: '选择支付方式', // 说明标题
	label: '支付方式',
};

export default SelectBank;