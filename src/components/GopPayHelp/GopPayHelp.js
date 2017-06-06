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
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';

import _ from 'lodash';
import $ from 'jquery';

import './GopPayHelp.less';

/**
 * @class 登录页面
 */
class GopPayHelp extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.props = props;
	}


	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {
	
	};

	closeHelp(){
		this.props.changeToHelp();
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<div className="pay-help">
					<div className="help-item">
						<div className="item-title">1.	支持的支付方式</div>
						<div className="item-content">果仁支付支持使用您在果仁宝账户的GOP进行支付，当GOP不足以支付交易时，系统会提示您通过绑定的银行卡购买后完成交易。</div>
					</div>
					<div className="help-item">
						<div className="item-title">2.	如何查看是否有使用优惠抵扣交易</div>
						<div className="item-content">第一步：确定订单原价，在支付过程中对比实际支付金额是否小于原价，小于则表示已经享受优惠，优惠信息会在订单支付页面中显示；<br/>
							第二步：进入手机果仁宝，点击【我的】-【我的账单】选择对应交易进入【账单详情】查看。
						</div>
					</div>
					<div className="help-item">
						<div className="item-title">3.	用果仁支付付款安全吗</div>
						<div className="item-content">任何安全总是相对的，果仁支付提供专业的风控团队保障您的资金安全，同时也提醒您输入支付密码时注意身边安全，不定期做好账户安全维护工作（如：修改密码/安全保护问题等），保障账户及资金安全。</div>
					</div>
					<div className="help-item">
						<div className="item-title">4.	平均成本价定义</div>
						<div className="item-content">您的平均成本价是在您多次购买果仁时，系统计算出来的您平均购买果仁的价格，在消费时可作为参考。</div>
					</div>
					<div className="help-item">
						<div className="item-title">5.	不付款会取消交易吗</div>
						<div className="item-content">交易下单后，长时间不付款，系统会关闭或取消该订单。如果您不想支付了，可以在订单支付页点击【返回icon】主动取消该交易。</div>
					</div>
					<div className="help-item">
						<div className="item-title">6.	付完款后如何申请退款</div>
						<div className="item-content">在合作网站上购买的商品付款完成后，如果需要退款，请拨打交易网站的客服电话申请退款。</div>
					</div>
				</div>

			</div>
		);
	}
}

//默认属性
GopPayHelp.defaultProps = { title:'登录' };

/**
 * @desc context
 * @type {{history: *}}
 */
GopPayHelp.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default GopPayHelp;