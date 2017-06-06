/**
 * @file 密码强度组件
 */

'use strict';

import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class PasswordLevel extends React.Component {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			textType: 'password'
		}
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		let level = ~~this.props.level;
		let levelData = this.props.levelData[level]||this.props.hiddenData;
		let classObj = {
			'password-level': true
		}
		classObj[levelData.className] = true;
		let classnames = classNames(classObj);
		return (
			<div className='password-level-wrap'>
				<div className={ classnames }>
					{ levelData.text }
				</div>
			</div>
		);
	}
}

/**
 * @desc 默认值
 * @type {{placeholder: string, name: string, forgetPassword: string, isToggle: boolean, onChange: PasswordInput.defaultProps.onChange}}
 */
PasswordLevel.defaultProps = {
	hiddenData: {
		text: '',
		className: 'hide'
	},
	levelData: [
		{
			text: '弱',
			className: 'low'
		},{
			text: '中',
			className: 'middle'
		},{
			text: '强',
			className: 'high'
		}
	]
}

export default PasswordLevel;