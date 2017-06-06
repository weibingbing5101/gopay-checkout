/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonInput from './common-input';
import validate from '../../modules/validate';

class PhoneInput extends CommonInput {

	constructor(props) {
		super(props);
	}

	checkValid(inputvalue){
		let isValidate = true;
		let errorMsg = '';
		let value = inputvalue.replace(/[^\d]/g,'');
		if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = '手机号不能为空';
		}else if(validate.mobileUnValidate(value)){
			isValidate = false;
			errorMsg = '手机号格式错误，正确格式为：';
		}
		return {
			error: !isValidate,
			message: errorMsg,
			value: value
		}
	}

}

PhoneInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '手机号',
	placeholder: '请输入手机号',
	type:'tel',
	name: 'phone-input',
	extra:{
		maxLength: 11
	}
};

export default PhoneInput;