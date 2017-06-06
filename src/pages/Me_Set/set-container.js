/**
 * @file 设置页面的容器
 */

'use strict';

import React from 'react';
import Header from '../../components/Header/header';

/**
 * @desc 设置页面
 * @param props
 * @returns {XML}
 * @constructor
 */
class Container extends React.Component {

	render() {
		const props = this.props;
		return (
			<div className="m-main-content">
				<div className="me-set-content">
					{ props.children }
				</div>
			</div>
		);
	}

}

export default Container;