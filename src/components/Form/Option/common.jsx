/**
 * @file option的基类
 */

'use strict';

import React from 'react';
import classNames from 'classnames';

class CommonOption extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	};

	render(){
		let optionClassName = classNames({
			'list-li': true,
			'selected': this.props.selected
		})
		let chidren = this.getChildren ? this.getChildren() : this.props.text;
		return (
			<div 
				value={ this.props.value } 
				diasbled={ this.props.disabled }  
				className={ optionClassName } 
				onClick={ this.props.onClick }>
					{ chidren }
			</div>
		);
	};
};

CommonOption.defaultProps = {
	onClick: () => {},
	value: -1,
	text: '',
	disabled: false
};

export default CommonOption;