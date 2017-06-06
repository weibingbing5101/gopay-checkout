/**
 * @file 图形验证码输入框 gengmangmang
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';

//验证码输入框
class VCodeImageInput extends React.Component {
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
		let value = e.target.value;
		this.props.handleCodeImageInput && this.props.handleCodeImageInput(value);
	};

	getTips(){
		if (this.props.errInfo) {
			return <span className="tip-err">{this.props.errInfo}</span>;
		}else{
			return <span>请输入图形验证码</span>;
		}
	}
	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div className="image-vcode-libox">
				<div className="vcode-libox-opacity">
					<input  
						className="vcode-libox-input" 
						maxLength={ 4}
						onChange={ function(e) { this.handleValue(e) }.bind(this) } />
					<img 
						className="vcode-libox-img" 
						src={this.props.vCodeImageUrl} 
						onClick={function(){this.props.getImageCode&& this.props.getImageCode()}.bind(this)}></img>
				</div>
				<div className="vcode-libox-tip">
					{this.getTips()}
				</div>
			</div>
		)
	}
}

VCodeImageInput.defaultProps = {
	hasClose: true
};

export default VCodeImageInput;