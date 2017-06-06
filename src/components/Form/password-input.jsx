/**
 * @file 密码输入input组件
 */

'use strict';

import React from 'react';
import { Link } from 'react-router';
import PasswordLevel from './password-level';
import $ from 'jquery';

class PasswordInput extends React.Component {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			textType: 'password'
		}
	};

	/**
	 * @desc 切换input状态
	 */
	toggleBtn() {
		this.setState({
			textType: (this.state.textType == 'password') ? 'text' : 'password'
		});
	};

	handleValue(e) {
		let oInputClose = $(e.target).parent().find('.input-close');
		let data = {};
		data[e.target.name] = e.target.value;
		this.props.onChange(data);
		if(e.target.value!=""){
			oInputClose.css('display','block');
		}else {
			oInputClose.css('display','none');
		}
	};

	/**
	 * 清除输入框内容
	 */
	clearInput(e){
		let input = $(e.target).parent().find("input")[0].name;
		let data = {};
		data[input] = '';
		this.props.onChange(data);
		$(e.target).parent().find("input")[0].value="";
		$(e.target).css("display","none")
	};

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		//有的加入密码状态与文本状态切换的按钮
		const toggleBtnTpl = this.props.isToggle == 'true' ?
				<a href="javascript:;" className="input-look-pass" onClick={ function() { this.toggleBtn() }.bind(this) }>
					<i className="iconfont icon-eye"></i>
				</a>
				: '';
		// 密码强度
		const levelTpl = this.props.pwdLevel !== undefined ?
				<PasswordLevel level={ this.props.pwdLevel } />
				: '';
		// 右侧close
		let closeTpl = this.props.hasClose ? (
			<span className="iconfont icon-close input-close" onClick={ this.clearInput.bind(this) } style={{display:'none'}}></span>
		):('');
		//左侧label
		let inputTitle = this.props.title;

		let input = <input onChange={ function(e) { this.handleValue(e) }.bind(this) } type={ this.state.textType } className="input" placeholder={ this.props.placeholder } name={ this.props.name } maxLength="16" />;

		if(this.props.onlyInput){
			return (
				<label className="input-label input-plain">
					{ input }
					{ levelTpl } 
				</label>
			);
		}

		//TODO: label和title冲突,要改样式

		return (
			<li>
				{(() => {
					switch (!!this.props.label) {
						case true: return (
							<label className="input-label">
	              <span className="input-label-name">
	                { this.props.label }
	              </span>
								{ input }
								{ levelTpl }
							</label>
						);
						default: return (
							<div className="number-input">
								<span className="input-title">{ inputTitle }</span>
								{ input }
								{ closeTpl }
								{ toggleBtnTpl }
								{ levelTpl }
							</div>
						);
					}
				})()}
			</li>
		);
	};
};

/**
 * @desc 默认值
 * @type {{placeholder: string, name: string, forgetPassword: string, isToggle: boolean, onChange: PasswordInput.defaultProps.onChange}}
 */
PasswordInput.defaultProps = {
	placeholder: '请输入密码',
	name: 'password',
	forgetPassword: 'false',
	isToggle: false,
	onChange: () => {},
	hasClose: true,
	title: '密码'
}

export default PasswordInput;