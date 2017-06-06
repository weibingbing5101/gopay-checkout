/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonInput from './common-input';
import validate from '../../modules/validate';

class RealNameInput extends CommonInput {

	constructor(props) {
		super(props);
	};

	checkValid(inputvalue){
		let isValidate = true;
		let errorMsg = '';
		let value = inputvalue.replace(/[^\u2E80-\u9FFF]/g,'');
		if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = '姓名不能为空';
		}else if(validate.isRealName(value)){
			isValidate = false;
			errorMsg = '请输入2-4位中文姓名';
		}
		return {
			error: !isValidate,
			message: errorMsg,
			value: value
		}
	};
};

RealNameInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '真实姓名',
	placeholder: '请输入真实姓名',
	name: 'real-name-input',
	extra:{
		// maxLength: 19,
		// minLength: 16
	}
};

export default RealNameInput;