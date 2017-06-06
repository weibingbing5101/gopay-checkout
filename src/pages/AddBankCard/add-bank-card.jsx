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
		/*
		let cardHoder = GYUserStore.getAuthenticationInfoStore() ? GYUserStore.getAuthenticationInfoStore() : false;
		if(!cardHoder){
			CommonAction.alert('请您按照正常流程绑定银行卡，3秒后跳转');
			setTimeout(()=>{
				this.context.history.pushState(null, '/authentication');
			},3000);
		}
		*/
		// 进入此页面有2种情况（1、已实名  2、未实名 ）
		GYUserAction.isAuthentication({});

		// 获取URL中订单参数
		this.searchJson = LocationSearchToJson();

		this.state = {
			cardHoder:'',
			bankCardNum: '',
			btnState: false
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
		if(info && info.error){
			CommonAction.alert(info.error);	
			return false;	
		}		// 进入此页面有2种情况（1、已实名  2、未实名 ）
		if(info && info.type === 'isAuthentication'){
			if(info.error && info.error === '未实名认证'){
				CommonAction.alert('您还未实名认证，3秒后为您跳转实名认证页面');
				setTimeout(()=>{
					// this.searchJson.fromePage = 'buy_gop_add_bank_card';
					this.context.history.pushState(null, '/authentication?'+LocationSearchJsonToUrl(this.searchJson));
				},3000);
			}else{
				GYUserAction.getAuthenticationInfo({});
			}
		}

		// 已实名  获取实名信息 
		if(info && info.type === 'authentication'){
			if(info.error){
				CommonAction.alert(info.error);
			}else{
				let name = info.info && info.info.data && info.info.data.name ? info.info.data.name : '';
				this.setState({
					cardHoder: name
				});				
			}
		}

		// 绑定银行卡
		if(info && info.type === 'getBankInfo'){
			if(info.error){
				CommonAction.alert(info.error);
			}else{
				this.context.history.pushState(null, '/add_bank_card_step?'+LocationSearchJsonToUrl(this.searchJson));			
			}
		}
	};

	// 银行卡input失J事件
	bankInputBlur(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.bankCardNum = newState.value;
		console.log(state.bankCardNum);
		// 有错误
		if(state.error){
			state.btnState = false;
		}else{
			state.btnState = true;
		}
		this.setState(state);
	};

	// 添加银行卡下一步
	addbankcardClick() {
		if( this.state.btnState){
			let bankCardNum = this.state.bankCardNum;
			console.log('银行卡号正确  下一步');
			// 获取银行卡 相关信息  setstore  下一步使用
			GYUserAction.getBankInfo({
				bankCard: bankCardNum
			});
		}else if(!this.state.btnState){
			return false;
			CommonAction.alert('请填写正确银行卡号');
		}
	};
	// 只有添加银行卡流程过来的还会有step进度条提示
	getTitleStep(){
		if(this.searchJson.fromePage === 'buy_gop_add_bank_card'){
			return <Step step = '2'/>;
		}
	};

	changeToSupportBankList(){
		this.context.history.pushState(null, '/support_bank_list?'+LocationSearchJsonToUrl(this.searchJson));
	}
	
	render() {
		let titleStep = this.getTitleStep();
		return (
			<div>
				<form autoComplete="off">
					{titleStep}
					<ul>
						<p className="addbankcard-tips">添加一张您本人的储蓄卡</p>
						<li className="addbankcard-bankcard-name-cangory">
							<label className="addbankcard-bankcard-name-cangory-warp">
								<p className="addbankcard-bankcard-name-cangory-left">持卡人</p>
								<p className="addbankcard-bankcard-name-cangory-right">
									{ this.state.cardHoder}
								</p>
							</label>
						</li>
						<BankNumberInput
							onChange = { function(state) { this.bankInputBlur(state) }.bind(this) }
						/>
						<li className="addbankcard-bankcard-payfornumber" onClick={function(){this.changeToSupportBankList()}.bind(this)}>
							支持的银行卡和支付限额
						</li>
						<li className="addbankcard-btn-area">
							<Button onClick={ function() { this.addbankcardClick() }.bind(this) } title="下一步" btnState={ this.state.btnState }/>
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