/**
 * @file 电话输入框
 */

'use strict';

import React from 'react';
import classNames from 'classnames';

class KeybordCommonInput extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			value: '',
			isKeybordBoxShow: this.props.isKeybordCommonInput,
		};
	};

	onFocus(){
		// console.log('键盘模拟input的onFocus');
		// this.setState({
		// 	isKeybordBoxShow: true
		// });
	};

	onBlur(){
		this.setState({
			isKeybordBoxShow: false
		});		
	};

	keyPress(value){
		console.log(value);
		this.props.onChange && this.props.onChange(value);
		this.setState({
			value: value
		});
	};

	render(){
		let props = this.props;
		let inputClassNames = classNames({
			'keyboard-input-gary': !this.state.value,
			'keyboard-input-black': this.state.value
		});
		return(
			<div className="keybord-input-warp">
				<span className={ inputClassNames } onClick={ function(){ this.onFocus() }.bind(this) }>{ this.state.value ? this.state.value : props.placeholder }</span>
				<this.props.children.type
					maxLength = { props.maxLength }
					onPress={ function(value){ this.keyPress(value) }.bind(this)}
					isKeybordBoxShow = { this.state.isKeybordCommonInput }
					keybordClose = { function(){ this.onBlur() }.bind(this) }
				>
				</this.props.children.type>
			</div>
		);
	};

};

KeybordCommonInput.defaultProps = {
	onChange: () => {},
	hasClose: true,
	placeholder: '请输验证码',
	name: 'keybord-common-input'
};

export default KeybordCommonInput;