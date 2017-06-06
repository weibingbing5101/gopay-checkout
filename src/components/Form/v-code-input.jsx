/**
 * @file 注册验证码输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';

//验证码输入框
class VCodeInput extends React.Component {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
	}

	/**
	 * @desc 当验证码修改的时候 调用父容器传过来的方法
	 * @param e
	 */
	handleValue(e) {
		let oInputClose = $(e.target).parent().find('.input-close');
		let value = e.target.value.replace(/[^\d]/g,'');
		let err = value && value.length === 6 ? false : true;
		let message = err ? '验证码错误' : '';
		console.log(err);
		this.props.onChange({
			value: value,
			error: err,
			message: message
		});

		this.setState({
			value: value
		});

		if(value.length){
			oInputClose.css('display','block')
		}else {
			oInputClose.css('display','none')
		}
	};

	getVCode(){
		this.keybordShow && this.keybordShow();
		this.props.getVCodeFN && this.props.getVCodeFN();
	};

	/**
	 * 清楚输入的内容
	 * @param e
   */
	clearInput(e){
    	this.props.onChange({
			value: '',
			error: true,
			message: '验证码不能为空'
		});
		this.setState({
			value: ''
		});
		$(e.target).css("display","none")
	}

	getInputCloseDom(){
		let placeholderClassName = this.props.inputValue?"input-v-code-num":"input-v-code-placeholder";
		let inputClose = this.props.hasClose ? (
			<i className="iconfont icon-close input-close" onClick={ this.clearInput.bind(this) } style={{display:'none'}}/>
		):("");
		let input = this.props.isKeybordInput ? (
			<span className={placeholderClassName} id="input-v-code-num"
				onClick={ function(){ this.props.keybordInputShowOrClose(true) }.bind(this)} 
			> 
				{ this.props.inputValue ? this.props.inputValue :"请输入验证码" }
			</span>
		):(
			<input
				maxLength={ this.props.maxLength}
				value = { this.state.value }
				onChange={ function(e) { this.handleValue(e) }.bind(this) } 
				type="tel" 
				className="input-v-code input" 
				placeholder="请输入验证码" 
			/>
		);
		return (
			<span>
				{ input }
				{ inputClose }
			</span>
		);
	};

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		let inputCloseDom = this.getInputCloseDom && this.getInputCloseDom();
		let classnames = {
			'number-input': true
		}
		let inputVCodeClassName = classNames({
			'input-v-code-sendCode': true,
			'input-v-code-sendCode-disabled': this.props.isCodeSended		
		});

		if(this.props.className){
			classnames[this.props.className] = true;
		}
		classnames = classNames(classnames);
		return (
			<li className="number-input-libox">
				<div className={ classnames }>
					<span className="input-wrap">
						<label htmlFor="input-v-code-num"></label>
						<span className="input-title">验证码</span>
						{ inputCloseDom }
					</span>
					<a className={inputVCodeClassName} onClick={  this.getVCode.bind(this) }>{this.state.codeTips}</a>
				</div>
			</li>
		)
	}
}

VCodeInput.defaultProps = {
	getVCode: () => {},
	onChange: () => {},
	codeTips:'获取验证码',
	hasClose: true
};

export default VCodeInput;