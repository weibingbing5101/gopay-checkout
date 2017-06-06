/**
 * @file 注册验证码输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import VCodeInput from './v-code-input';


//验证码输入框
class VCodeTimerInput extends VCodeInput {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.timer = null;
		this.s = this.props.s ? parseInt(this.props.s) : 0;
		this.state = {
			codeTips: '获取验证码'
		};
	};

	componentWillUnmount(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	sentTimerVCode(cbfn){
		if(this.timer === null || this.s===0){
			cbfn && cbfn(function(){
				this.timer = setInterval(()=>{
					this.s = this.s - 1;
					if(this.s === 1){
						clearInterval(this.timer);
						this.timer = null;
						this.s = 60;
						this.setState({
							codeTips: '获取验证码'
						});	
					}else{
						this.setState({
							codeTips: this.s + 's重新获取'
						});				
					}
				},1000)
			}.bind(this));
		};
	};

	/*
	获取验证码点击事件
	 */
	getVCode(){
		this.props.getVCodeFN && this.props.getVCodeFN( this.sentTimerVCode.bind(this) , this.s);
	};

}

VCodeTimerInput.defaultProps = {
	getVCode: () => {},
	onChange: () => {},
	codeTips:'获取验证码',
	hasClose: true
};

export default VCodeTimerInput;