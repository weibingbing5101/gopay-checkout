/**
 * @file 登录
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { PhoneInput, VCodeInput, BankNumberInput} from '../../components/Form';
import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface, GYUserInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';
// 步骤
import Step from '../../components/Step/step';

import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';

import _ from 'lodash';

import './index.less';

/**
 * @class 登录页面
 */
class AddBankCard extends React.Component {
	constructor(props) {
		super(props);
		this.bankCangoryJson = {
			'SAVINGS_DEPOSIT_CARD':' (储蓄卡) ',
			'':'信用卡'
		};

		// 获取URL中订单参数
		this.searchJson = LocationSearchToJson();

		let bankCardInfor = GYUserStore.getBankInfoStore() ? GYUserStore.getBankInfoStore() : false;
		if(!bankCardInfor){
			CommonAction.alert('请您按照正常流程绑定银行卡，3秒后跳转');
			setTimeout(()=>{
				this.context.history.pushState(null, '/add_bank_card?'+LocationSearchJsonToUrl(this.searchJson));
			},3000);
		}
		this.state = {
			bankName: bankCardInfor.bankName,
			cardNo: bankCardInfor.cardNo,
			mobile: '',
			bankCangory: this.bankCangoryJson[bankCardInfor.cardType],
			bankType: bankCardInfor.cardType,
			btnState: false,
			phoneNext: false,
		};
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};
	componentWillUnmount() {
		this.unsubscribe();
	};
	onStoreChanged(info) {
		console.log(info);
		if(info.error){
			CommonAction.alert(info.error);			
		}else{
			this.searchJson.fromePage='';
			this.context.history.pushState(null, '/buy_gop?'+LocationSearchJsonToUrl(this.searchJson));
		}
	};

	// 手机号输入
	phoneInputChange(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.mobile = newState.value;
		// 有错误
		if(state.error){
			state.btnState = state.phoneNext = false;
		}else{
			state.btnState = state.phoneNext = true;
		}
		this.setState(state);
	};

	// 添加银行卡下一步
	addbankcardClick() {
		let queryDate = this.state;
		if(this.state.phoneNext){
			// 绑定银行卡
			GYUserAction.bindBankcard({
				bankName: queryDate.bankName,
				cardNo: queryDate.cardNo,
				bankPhone: queryDate.mobile,
				bankType: queryDate.bankType,
			});
		}else{
			return false;
			CommonAction.alert('请填写正确手机号');
		}
	};
	// 只有添加银行卡流程过来的还会有step进度条提示
	getTitleStep(){
		if(this.searchJson.fromePage === 'buy_gop_add_bank_card'){
			return <Step step = '3'/>;
		}
	};

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		let titleStep = this.getTitleStep();
		return (
			<div>
				<form autoComplete="off">
					{titleStep}
					<ul>
						<p className="addbankcard-tips">您添加的银行卡会在支付时绑定</p>
						<li className="addbankcard-bankcard-name-cangory">
							<label className="addbankcard-bankcard-name-cangory-warp">
								<p className="addbankcard-bankcard-name-cangory-left">卡类型</p>
								<p className="addbankcard-bankcard-name-cangory-right">
									{ this.state.bankName}
									{ this.state.bankCangory}
								</p>
							</label>
						</li>							
						<PhoneInput
							onChange={ function(state) { this.phoneInputChange(state) }.bind(this) }
							placeholder = "请输入银行预留手机号码"
						/>
						<li className="addbankcard-btn-area">
							<Button onClick={ function() { this.addbankcardClick(2) }.bind(this) } title="下一步" btnState={ this.state.btnState }/>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}

//默认属性
AddBankCard.defaultProps = {  

};

/**
 * @desc context
 * @type {{history: *}}
 */
AddBankCard.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default AddBankCard;