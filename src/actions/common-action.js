/**
 * @file 公共功能action
 */

'use strict';

import Reflux from 'reflux';

//跟用户相关的操作都放在这里
const CommonAction = Reflux.createActions([
	'alert',
	'loading',
	'updateTitle'
])

export default CommonAction;