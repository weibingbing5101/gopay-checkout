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

import './PayProcessing.less';

const processingImg = require('./img/zf_cs@3x.png');
/**
 * @class 登录页面
 */
class PayProcessing extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
	
		};

		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(false);
	}


	componentDidMount() {
		this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
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
			<div className="pay-processing">
				{gopPayTitle}
				<div className="pay-processing-top">
					<img className="top-img" src={ processingImg } />
				</div>
				<div className="pay-processing-middle">
					<div>服务器异常
					</div>
					<div>您的支付结果还在路上
					</div>
				</div>
				<div className="pay-processing-bottom">
					<div>为避免重复支付
					</div>
					<div>请稍后咨询果仁宝客服查询结果<span className="bottom-phone">400-184-9696</span>
					</div>
				</div>
			</div>
		);
	}
}

//默认属性
PayProcessing.defaultProps = {
	noHeader: true 
};

/**
 * @desc context
 * @type {{history: *}}
 */
PayProcessing.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default PayProcessing;