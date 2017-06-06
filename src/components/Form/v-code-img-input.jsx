/**
 * @file 注册验证码输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';

//验证码输入框
class VCodeImgInput extends React.Component {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * @desc 当验证码修改的时候 调用父容器传过来的方法
	 * @param e
	 */
	handleValue(e) {
		this.props.onChange({
			vCode: e.target.value
		});
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<li className="number-input-libox">
				<div className='vcode-img-item'>
					<span>为保护您的账户安全，请输入下图中的字符</span>
				</div>
				<div onClick={ this.props.changeVcode } className='vcode-img-item'>
					<img src={this.props.vcodeUrl} className='img' />
					<span className="vcode-change">看不清，换一张</span>
				</div>
				<div className='number-input'>
					<span className="input-title">验证码</span>
					<input onChange={ function(e) { this.handleValue(e) }.bind(this) } type="tel" className="input" placeholder="验证码" />
				</div>
			</li>
		)
	}
}

VCodeImgInput.defaultProps = {
	getVCode: () => {},
	onChange: () => {}
};

export default VCodeImgInput;