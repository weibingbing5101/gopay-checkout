/**
 * @file 输入框的基类
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
import Keybord from './keybord.jsx';

//import validate from '../../modules/validate';
import './index.less';

class CodeKeybord extends Keybord {

	constructor(props) {
		super(props);
		let prop = this.props;
	};
};



CodeKeybord.defaultProps = {
	onChange:()=>{},
	//title:'请输入验证码',
	isHasKeywarp: false,
	keyVals: [1,2,3,4,5,6,7,8,9,'',0,'delete']
};

export default CodeKeybord;