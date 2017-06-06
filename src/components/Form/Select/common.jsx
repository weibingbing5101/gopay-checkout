/**
 * select基类
 */
'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { PropTypes } from 'react-router';

class Select extends React.Component {
	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			optionsIsShow: false
		};
		this.selectedValue = -1;
	};

	showOptions(){
		if(this.props.selectOnClick){
			this.props.selectOnClick(this.props.selectedItem);
		}
		this.setState({
			optionsIsShow: true
		});				
		
	};	
	hideOptions(){
		this.setState({
			optionsIsShow: false
		});
	};

	onChange(props){
		let onChange = this.props.onChange;
	    let value = props.value;
	    let data = props.data;
	 
	 	// buy_gop  页面switch
	  	if(onChange){
	  		this.selectedValue = value;
	  		onChange(value, data);
	  	}
	  	if(!props.disabled){
	  		this.hideOptions();
	  	}
	};

	compileOption(child, index){
		let value = child.props.value;
	  	return <child.type {...child.props} 
			  		onClick={  function(){ this.onChange(child.props) }.bind(this) } 
			  		key={ 'option'+index }
			  		selected = { this.selectedValue === value }
			  	>
			  	</child.type>;
	};

	/**
	 * 编译option，这里主要是为option添加关闭事件以及把点击的option的值传递回去
	 * @param  {Array} children option数组
	 * @return {Arrar}          编译之后的options
	 */
	compileOptions(children) {
	    return children instanceof Array ? 
	    	children.map(this.compileOption.bind(this)) : this.compileOption(children, 0);
    }


	render() {
		let selectOutBoxClassName = classNames({
			'select-wrapout-box': true,
			'select-wrap-box-show': this.state.optionsIsShow,
			'select-wrap-box-hide': !this.state.optionsIsShow,
		});

		let selectedOptionClass = classNames({
			'input-v-code-sendCode': true, 
			'select-box-right': true, 
			'select-selected-item': true
		});

		let selectLabel = this.props.label;
		let len = this.props.selectedItem.cardNo && this.props.selectedItem.cardNo.length;
		let str = this.props.selectedItem.cardNo;
		console.log(this.props.selectedItem);
		let selectedName = this.props.selectedItem.bankName;
		if (str) {
			selectedName  +=' 储蓄卡'+'（'+str.substring(len-4,len)+'）';
		}
		
		let optionTitle = this.props.optionTitle;

		let children = this.compileOptions(this.props.children);

		return (
			<div className="number-input-libox number-input-libox-margin">
				<div className="number-input select-box">
					<span className="input-wrap select-box-left">
						<span className="input-title">{ selectLabel }</span>
					</span>
					<a className={ selectedOptionClass }
						onClick={ function(){ this.showOptions() }.bind(this) }>
							{ selectedName }
					</a>
				</div>
				<div className={selectOutBoxClassName} onClick={ this.hideOptions.bind(this) }>
					<ul className="select-options-wrap">
						<div className="select-tit">
							<p className="select-close" onClick={ this.hideOptions.bind(this) }></p>
							<p className="select-titworld">{ optionTitle }</p>						
						</div>
						<div className="select-options-wrap-list">
							{ children }
						</div>
					</ul>
				</div>
			</div>
		);
	};
};




Select.defaultProps = {

};
Select.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}
export default Select;