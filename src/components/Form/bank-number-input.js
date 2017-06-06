/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonInput from './common-input';
import validate from '../../modules/validate';


class BankNumberInput extends CommonInput {

	constructor(props) {
		super(props);
	}

	checkValid(inputvalue){
		let isValidate = true;
		let errorMsg = '';
		let value = inputvalue.replace(/[^\d]/g,'');
		if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = ' 银行卡号不能为空';
		}else if(validate.limitLength(16, 19, value)){
			isValidate = false;
			errorMsg = ' 银行卡号必须16-19位';
		}
		return {
			error: !isValidate,
			message: errorMsg,
			value: value
		}
	}

}

BankNumberInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '银行卡号',
	placeholder: '请输入银行卡号',
	type:'tel',
	name: 'bank-number-input',
	extra:{
		maxLength: 19,
		minLength: 16
	}
};

export default BankNumberInput;