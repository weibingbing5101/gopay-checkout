/**
 * @file 输入框的基类
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
//import validate from '../../modules/validate';

class CommonInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			value: '',
			error: false,
			message: ''
		};
	};

	checkValid(value){
		return {
			error: false,
			message: '',
			value: value
		}
	};

	handleChange(e) {
		let value = e.target.value;
		let data = this.checkValid(value);
		this.setState(data);
		if(this.props.onChange && this.props.onChange.length){
			this.props.onChange(data);
		}
	};	
	handleBlur(e) {
		let value = e.target.value;
		let data = this.checkValid(value);
		this.setState(data);
		if(this.props.onBlur && this.props.onBlur.length){
			this.props.onBlur(data);
		}
	};

	clearInput(e) {
		let data = {
			value: '',
			error: true,
			message: '手机号不能为空'
		};
		this.props.onChange && this.props.onChange.length && this.props.onChange(data);
		this.props.onBlur && this.props.onBlur.length && this.props.onBlur(data);
		this.refs.input.value = '';
		this.setState(data);
	};

	getInputDom(){
		let inputClass = classNames({
			'input': true,
		});
		let props = this.props;
		return (
				<input 
					value={ this.state.value }
					onChange={ this.handleChange.bind(this) } 
					onBlur={ this.handleBlur.bind(this) } 
					ref="input"  
					type={ props.type||'text' } 
					className={inputClass} 
					placeholder={props.placeholder} 
					name={props.name}
					{...props.extra}
				/>
		);		
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

		let inputDom = this.getInputDom && this.getInputDom();

		return (
			<li className="number-input-libox">
				<span className={ wrapClass }>
					<span className="input-title">{ inputTitle }</span>
					{ inputDom }
					{ inputClose }
				</span>
			</li>
		);
	};
};

CommonInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	title: '输入框'
};

export default CommonInput;