/**
 * @file 输入框的基类
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import Keybord from './keybord.jsx';

//import validate from '../../modules/validate';
import './index.less';

class PasswordKeybord extends Keybord {

	constructor(props) {
		super(props);
		let prop = this.props;
	};

	componentWillReceiveProps(nextProps){
		console.log(nextProps);
		if(nextProps.lever){
			this.setState({
				value: []
			})
		}
		return nextProps
	};

	getTopChildren(){
		let props = this.props;
		let maxLengthArr = [];
		for(let i=0; i<props.maxLength; i++){
			maxLengthArr.push(i+1);
		}
		let passwordLengthClassName = 'lever'+ this.state.value.length;

		return(
			<div className="keybord-password">
				<ul className={passwordLengthClassName}>
					{
						maxLengthArr.map((index)=>{
							return <li key={index}><span></span></li>
						})
					}
				</ul>
				<p className="keybord-forget-password">
					<span className="keybord-err">{this.props.errMsg}</span>
					<a onClick={function(){this.props.forgetPasswordFn()}.bind(this)}>忘记密码？</a>
				</p>
			</div>
		);
	};
};

PasswordKeybord.defaultProps = {
	title:'输入支付密码',
	isHasKeywarp: true,
	keyVals: [1,2,3,4,5,6,7,8,9,'',0,'delete']
};

export default PasswordKeybord;