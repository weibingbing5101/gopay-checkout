/**
 * @file 按钮jsx
 */

'use strict';

import React from 'react';

const Btn = ( props ) => {

	return (
			<a onClick={ props.onClick } style={ props.style } className="btn">{ props.title }</a>
	);
};

Btn.defaultProps = {
	style: {
		background: '#37c7fd'
	}
};

export default Btn;