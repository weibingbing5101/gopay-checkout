/**
 * @file 登录
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { NumberInput, VCodeImgInput, VCodeInput } from '../../components/Form';
import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';

//果仁支付头部
import GopPayTitle from '../../components/GopPayTitle';

//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';

import _ from 'lodash';

import './PayFail.less';

const failImg = require('./img/zf_wrong@3x.png');
/**
 * @class 登录页面
 */
class PayFail extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			reason : props.location.state.reason
		};
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(false);
	}


	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {
	
	};


	backMethod(){
		if (window.backObj && window.backObj.backMessage) {
			window.backObj.backMessage();
		}
	}
	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		let gopPayTitle;
		if (window.backObj && window.backObj.backMessage) {
			gopPayTitle = (<GopPayTitle backMethod={function(){this.backMethod()}.bind(this)} payCompleted={true}></GopPayTitle>)  ;
		}
		return (
			<div className="pay-fail">
				{gopPayTitle}
				<div className="pay-fail-top">
					<img className="top-img" src={ failImg } />
				</div>
				<div className="pay-fail-middle">
					<div>支付失败
					</div>
				</div>
				<div className="pay-fail-bottom">
					<div>{this.state.reason}
					</div>
				</div>
			</div>
		);
	}
}

//默认属性
PayFail.defaultProps = {
	noHeader: true
};

/**
 * @desc context
 * @type {{history: *}}
 */
PayFail.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default PayFail;