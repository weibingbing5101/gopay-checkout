/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
// import $ from 'jquery';
//import validate from '../../modules/validate';

class NumberInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			value: '',
			error: false,
			message: ''
		}
	}

	handleValue(e) {
		let value = e.target.value;
		let isValidate = true;
		let errorMsg = '';
		/*if(validate.isEmpty(value)){
			isValidate = false;
			errorMsg = '手机号不能为空';
		}else if(validate.mobileUnValidate(value)){
			isValidate = false;
			errorMsg = '手机号格式错误，正确格式为：';
		}*/
		let data = {
			value: value,
			error: !isValidate,
			message: errorMsg
		};
		this.props.onChange(data);
		this.setState(data);
	}

	clearInput(e) {
		let data = {
			value: '',
			error: false,
			message: ''
		};
		this.props.onChange(data);
		this.refs.input.value = '';
		this.setState(data);
	};

	render(){

		let props = this.props;
		let wrapClass = classNames({
			'number-input': true
		});
		let closeClass = classNames({
			'iconfont': true,
			'icon-close': true, 
			'input-close': true
		});
		let closeShow =  this.state.value ? 'block' : 'none';
		let inputTitle = props.title;
		let inputClose = props.hasClose ? (
			<i className={closeClass} onClick={ this.clearInput.bind(this) } style={{display: closeShow }}/>
		):("");
		return (
			<li className="number-input-libox">
				<label className={ wrapClass }>
					<span className="input-title">{ inputTitle }</span>
					<input onChange={ this.handleValue.bind(this) } ref="input" type="tel" className="input" placeholder="请输入手机号" maxLength="11" name="userName" />
					{ inputClose }
					{ props.children }
				</label>
			</li>
		);
	};
}

NumberInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '输入框'
};

export default NumberInput;