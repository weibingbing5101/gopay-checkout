/**
 * @file 姓名输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonInput from './common-input';
import validate from '../../modules/validate';

class NameInput extends CommonInput {

	constructor(props) {
		super(props);
	}

	checkValid(value){
		let isValidate = true;
		let errorMsg = '';

		if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = '姓名不能为空';
		}else if(validate.mobileUnValidate(value)){
			isValidate = false;
			errorMsg = '姓名格式错误，正确格式为：';
		}
		return {
			error: !isValidate,
			message: errorMsg
		}
	}

}

NameInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '真实姓名',
	placeholder: "请输入真实姓名",
	name: 'name-input',
	extra:{
		
	}
};

export default NameInput;