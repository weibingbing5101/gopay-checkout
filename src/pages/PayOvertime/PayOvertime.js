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

import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';
import GopPayLoading from '../../components/GopPayLoading/loading.js';

import _ from 'lodash';

import './PayOvertime.less';

const overtimeImg = require('./img/zf_cs@3x.png');
/**
 * @class 登录页面
 */
class PayOvertime extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			//支付结果查询次数
			payTime: 0,
			interval: '',
			clickCount:0,

			//按钮状态
			btnState: true,
			isGyLoadingShow: false,			 // 加载组建显示隐藏
		};
		this.searchJson = LocationSearchToJson();

		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(false);
	}


	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {
		if(info){
			if (info.type && info.type=='GopCashieQueryPay') {
				if (this.state.payTime==3 && this.state.clickCount!=4) {
					this.state.payTime = 0;
					//this.state.btnState = true;
					this.setState({btnState:true,isGyLoadingShow:false});
					// this.setState({ isGyLoadingShow: false });
					clearInterval(this.state.interval);
				}else if (this.state.payTime==3 && this.state.clickCount==4) {
					this.failGetResult();
				}			
			}else if (info.error){
				CommonAction.alert(info.error);	
			}
			// return false;	
		}
		if (info && info.type == 'GopCashieQueryPay' && info.info && info.info.data) {
			if (info.info.data.status==2) {
				clearInterval(this.state.interval);
				this.setState({ isGyLoadingShow: false });
				this.state.payTime = 0;
				let marketArticle = JSON.parse(info.info.data.marketArticle);
				marketArticle.payAmount = info.info.data.payAmount;
				marketArticle.appName = info.info.data.appName;
				marketArticle.payTime = info.info.data.payTime;
				this.context.history.pushState({marketArticle:marketArticle}, '/pay_success?'+LocationSearchJsonToUrl(this.searchJson));
			}else if (info.info.data.status==1) {
				if (this.state.payTime==3 && this.state.clickCount==4) {
					this.failGetResult();
				}
			}else{
				clearInterval(this.state.interval);
				this.context.history.pushState({reason:info.info.data.failReason},'/pay_fail?'+LocationSearchJsonToUrl(this.searchJson));
			}
			
		}
		console.log(this.state.payTime);
		console.log(this.state.clickCount);
	};

	failGetResult(){
		clearInterval(this.state.interval);
		this.setState({ isGyLoadingShow: false });
		this.context.history.pushState(null,'/pay_process?'+LocationSearchJsonToUrl(this.searchJson));
	}

	getPayResult(){
		if (this.state.payTime==0) {
			this.setState({ isGyLoadingShow: true });
			this.state.clickCount++;
			this.state.btnState =false;
			let that = this;
			this.state.interval = setInterval(function(){
				let value = that.state.payTime+1;
				that.setState({payTime: value});
				GYUserAction.GopCashieQueryPay({
					version:that.searchJson.version,
					consNo:that.searchJson.consNo,
					//singleNo:that.searchJson.singleNo
				});
			},2000);
		}
		
	}

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
			<div className="pay-overtime">
				{gopPayTitle}
				<div className="pay-overtime-top">
					<img className="top-img" src={ overtimeImg } />
				</div>
				<div className="pay-overtime-middle">
					<div>请求超时
					</div>
				</div>
				<div className="pay-overtime-bottom">
					<div>若该笔订单支付成功，可通过果仁宝-我的账单查询
					</div>
				</div>
				<div className="pay-overtime-btn">
					<Button onClick={ function() { this.getPayResult() }.bind(this) } 
						btnState={this.state.btnState}>重新获取支付结果</Button>
				</div>
				<GopPayLoading
					isGyLoadingShow = { this.state.isGyLoadingShow }
					gyLoadingTxt = "正在请求支付结果，请稍等！"
				>
				</GopPayLoading>
			</div>
		);
	}
}

//默认属性
PayOvertime.defaultProps = {
	noHeader: true 
};

/**
 * @desc context
 * @type {{history: *}}
 */
PayOvertime.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default PayOvertime;