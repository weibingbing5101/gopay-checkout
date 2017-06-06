/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonInput from './common-input';
import validate from '../../modules/validate';

class IDNumberInput extends CommonInput {

	constructor(props) {
		super(props);
	}

	checkValid(inputvalue){
		let isValidate = true;
		let errorMsg = '';

		let value = inputvalue.replace(/[^\dxX]/g,'');
		if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = '身份证号码不能为空';
		}else if(validate.isRealIDNumber(value)){
			isValidate = false;
			errorMsg = '请输入15-18位有效的身份证号码';
		}
		return {
			error: !isValidate,
			message: errorMsg,
			value: value
		}
	}

}

IDNumberInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '身份证号',
	placeholder: '请输入具体的身份证号码',
	name: 'id-number-input',
	extra:{
		maxLength: 18,
		minLength: 18
	}
};

export default IDNumberInput;