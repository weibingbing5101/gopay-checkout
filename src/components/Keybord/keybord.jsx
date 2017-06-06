/**
 * @file 输入框的基类
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import validate from '../../modules/validate';
import './index.less';

class Keybord extends React.Component {

	constructor(props) {
		super(props);
		let prop = this.props;
		this.state = {
			value: ''
		};
	};

	keybordClose(){
		this.props.keybordClose && this.props.keybordClose(false);
	};


	// 按键输入 区分删除 添加
	handleChange(ev) {
		ev.preventDefault();
		let props = this.props;
		let keyValue = ev.target.getAttribute('data');
		let inputValue = this.state.value;
		
		// 根据输入值改变内容
		if(keyValue){
			if(keyValue!='delete' && props.maxLength && inputValue.length < props.maxLength){
				inputValue = inputValue + keyValue;
			}
			if(keyValue ==='delete'){
				console.log(inputValue);
				inputValue = inputValue.substr(0,inputValue.length-1);
			}
			this.setState({
				value: inputValue,
			});	
		}

		// buy_gop页面调用的函数
		props.onPress && props.onPress(inputValue);
		// 返回给调用处的数据		
		console.log(inputValue);
	};	

	getTitleChildren(){
		let props = this.props;
		let content='';
		if (props.title) {
			content=(
				<div className="keybord-title">
					<span className="keybord-title-close" onClick={function(){ this.keybordClose() }.bind(this)}></span>
					<p className="keybord-title-txt">{props.title}</p>
				</div>
			);
		}
		return content;
	};

	getContentChildren(){
		let props = this.props;
		return (
			<div className="keybord-content">
				<p className="keybord-content-title">
					<span className="keybord-content-title-icon"></span>
					<span>果仁宝安全键盘</span>
				</p>
				<ul className="keybord-content-ul">
					{
						props.keyVals.map((value,index)=>{
							let liClassNames = classNames({
								'keybord-content-li': true,
								'keybord-content-li-delete': value === 'delete' ? true : false
							});
							let val = value === 'delete' ? '' : value
							return  <li 
										className={ liClassNames } 
										key={index}
										data = { value }
										onTouchStart={ e=> e.preventDefault()}
										onTouchMove={ e=> e.preventDefault()}
										onTouchEnd={ function(ev){  this.handleChange(ev) }.bind(this) }
									>
										{ val }
									</li>
						})
					}
				</ul>
			</div>
		);
	};

	render(){
		let props = this.props;
		let titleChildren = this.getTitleChildren ? this.getTitleChildren() : '';
		let topChildren = this.getTopChildren ? this.getTopChildren() : '';
		let contentChildren = this.getContentChildren ? this.getContentChildren() : '';
		let warpBoxClassNames = classNames({
			'keybord-keywarp-opacity1': props.isHasKeywarp && this.props.isKeybordBoxShow,
			'keybord-keywarp-opacity0': !props.isHasKeywarp && this.props.isKeybordBoxShow
		});

		let keybordBoxClassName = classNames({
			'keybord-box': true,
			'keybord-show': this.props.isKeybordBoxShow,
			'keybord-hide': !this.props.isKeybordBoxShow			
		});

		return (
			<div className="keybord-keywarp">
				{props.hideModal ? false : <div className = { warpBoxClassNames }  onClick={function(){ this.keybordClose() }.bind(this)} ></div>}
				<div className={ keybordBoxClassName } id='keyborad-content'>
					{titleChildren}
					{topChildren}
					{contentChildren}
				</div>
			</div>
		);
	};
};

Keybord.defaultProps = {

};

export default Keybord;