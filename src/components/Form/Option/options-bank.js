'use strict';

import React from 'react';
import classNames from 'classnames';
import CommonOption from './common-option';


//验证码输入框
class OptionsBank extends CommonOption {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			bankIcon:{
				'浦发银行': 'bank-icon-pufa',
				'中国工商银行': 'bank-icon-gongshang'
			}
		};
	};
	// onChange(item,index){
	// 	this.props.onChange(item,index);
	// }

	// 银行卡选项
	// getOption(){
	// 	console.log(this.props.optionsData);
	// 	let options = this.props.optionsData;
	// 	return this.props.optionsData.map(function(item,index){
	// 		let optionsBankClassIcon = classNames('list-li-icon' , this.state.bankIcon[item.name]);
	// 		let optionsBankClassSelect = classNames(
	// 			// item.lastnum != this.props.selectedItem.lastnum ? 'list-li-select' : 'list-li-select list-li-selected'
	// 		);

	// 		return	<li className="list-li" key={index} onClick={ function(){ this.onChange(item,index) }.bind(this)}>
	// 					<span className= { optionsBankClassIcon }></span>
	// 					<p className="list-li-name_num">{item.name}{item.cangory}{item.lastnum}</p>
	// 					<span className={ optionsBankClassSelect }></span>
	// 				</li>
	// 	}.bind(this))
	// };

	// 银行卡添加
	// getOptionAdd(){
	// 	let optionsBankClassIcon = classNames('list-li-icon','list-li-icon-add');
	// 	let optionsBankClassWorld = classNames('list-li-name_num', 'list-li-name_num-add');
	// 	let optionsBankClassSelect = classNames('list-li-bank-add');

	// 	return <li className="list-li">
	// 				<span className={ optionsBankClassIcon }></span>
	// 				<p className={ optionsBankClassWorld }>添加银行卡</p>
	// 				<span className={optionsBankClassSelect}></span>
	// 			</li>
	// };

	// render() {
	// 	return (
	// 		<div className="option-item">
	// 			{ this.getOptions(this.props.optionsData) }
	// 			{ this.getOptionAdd() }
	// 		</div>
	// 	)
	// };
};




OptionsBank.defaultProps = {
	// getList: () => {}//,
	//onChange: () => {},
	//hasClose: true
};

export default OptionsBank;