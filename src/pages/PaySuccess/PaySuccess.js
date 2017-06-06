/**
 * @file 登录
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { NumberInput, VCodeImgInput, VCodeInput } from '../../components/Form';
import { Button } from '../../components/Button';
import Modal from '../../components/Modal';
import {GopTitle, GopWeixin, GopExperience} from '../../components/Gop';
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
import classNames from 'classnames';
//全局配置
import { globalConfig } from '../../modules/config';

//果仁支付头部
import GopPayTitle from '../../components/GopPayTitle';

import _ from 'lodash';

import './PaySuccess.less';
import cookieObj from '../../modules/cookie';

const cookie = cookieObj.cookie;

const successMark = require('./img/zf_wc@3x.png');
const successWallet = require('./img/gf_cg_xqd@2x.png');
const successDownloadLogo = require('./img/gf_grb@2x.png');

import { LocationSearchToJson } from '../../modules/tools';
/**
 * @class 登录页面
 */
class PaySuccess extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		let marketArticle = {};
		if (props.location.state && props.location.state.marketArticle) {
			// marketArticle = JSON.parse(props.location.state.marketArticle);
			marketArticle = props.location.state.marketArticle;
			if (marketArticle.content) {
				let amount = marketArticle.amount;
				let content = marketArticle.content;
				content = content.split(amount);
				marketArticle.content = content;
				marketArticle.amount = amount;
			}
		}
		let mobile = '';
		if (cookie('mobile')) {
			mobile = cookie('mobile');
			mobile = mobile.replace(mobile.substr(3,4),'****');
		}

		/*debug start*/
		/*marketArticle={
			amount: 12,
			content: ['爱疯', '是打发'],

			isScan: true,
			payAmount: 102,//支付金额 元
			promotionsContent: '立减5元',// 支付优惠文案(立减5元,8折,满20减5)
			appName: '肯德基',//商户应用名称
			payTime: '2014-09-09 12:34:12',//交易完成时间
			actualGopPrice: '15.92', //实际支付果仁价格
			actualGopAmount: 12// 实际支付果仁数量
		}
		mobile = 18611682011*/
		/*debug end*/


		let searchObj = LocationSearchToJson()||{};


		marketArticle.isScan = searchObj.isScan;


		this.state = {
			marketArticle : marketArticle,
			mobile:mobile,
			giftGopShow: false
		};

		this.gopHasShow = false;

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

	changeTo(){
		window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.guorenbao.wallet';
	}

	backMethod(){
		if (window.backObj && window.backObj.backMessage) {
			window.backObj.backMessage();
		}
	}

	_getGiftGop=()=>{
		let giftGop = (
			<Modal visible = { this.state.giftGopShow }>
		    <div className="pay-suc-gop">
		    	<div className="pay-suc-gop-detail">
		    		<GopTitle />
		    		<GopExperience />
		    		<GopWeixin />
		    	</div>
		    	<div className="pay-suc-gop-close" onTouchEnd={ ()=>this.setState({giftGopShow: false}) }>
		    		<span className="icono-crossCircle"></span>
		    	</div>
		    </div>
			</Modal>
		);

		if(!this.gopHasShow){

			setTimeout(()=>{
				this.setState({giftGopShow: true})
			}, 1000)

			this.gopHasShow = true;
		}

		return giftGop;
	}

	_getQcPayInfo =()=>{
		let marketArticle = this.state.marketArticle;
		let detail = [ 
			['订单金额', 'payAmount'],
			['商店应用', 'appName'],
			['交易时间', 'payTime']
		];
		detail = detail.map(function(data, index){
			let value = marketArticle[data[1]];
			let itemClass = "pay-suc-qc-item" + (index <  detail.length - 1 ? ' pay-suc-qc-line' : '' );  
			return value ? (
				<li key={index} className={itemClass}>
					<span  className="pay-suc-qc-title">
						{data[0]}
					</span>
					<span className="pay-suc-qc-value">
						{value}
					</span>
				</li>
			) : false;
		});

		return (
			<div className="pay-suc-qc">
				<div className="pay-success-middle">
					<div>{'成功支付G'+(marketArticle.actualGopAmount||0)}</div>
				</div>
				<ul className="pay-suc-qc-detaill">
					{detail}
				</ul>
				<Button className="pay-suc-qc-btn" onClick={ ()=>{window.close()} } title="完成" btnState={ true } />
				{ this._getGiftGop() }
			</div>
		)

	}

	_getNormalPayInfo=()=>{
		let marketArticle = this.state.marketArticle;

		let marketArt = marketArticle && marketArticle.content ? (
			<div className="pay-success-center">
				<div>
					<span>{marketArticle.content[0]}</span>
					<span className="center-num">{marketArticle.amount}</span>
					<span>{marketArticle.content[1]}</span>
				</div>
				<div>已放入您[{this.state.mobile}]账户中
				</div>
			</div>		
		):("");

		return (
			<div>
				<div className="pay-success-middle">
					<div>支付完成
					</div>
				</div>
				{ marketArt }
			</div>
		)
	}

	_getPayInfo=()=>{

		let payInfo;

		let marketArticle = this.state.marketArticle;

		if(marketArticle.isScan){
			payInfo = this._getQcPayInfo();
		}else{
			payInfo = this._getNormalPayInfo();
		}
		
		return  payInfo;
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

		let marketArticle = this.state.marketArticle;

		let wrapClass = classNames({
			"pay-success-top": true,
			"pay-success-qc": marketArticle.isScan
		});
		return (
			<div className="pay-success">
				{gopPayTitle}
				<div className={wrapClass}>
					<img className="top-img" src={ successMark } />
				</div>
				{ this._getPayInfo() }
				<div className="pay-success-bottom">
					<img className="bottom-img" src={successDownloadLogo} />
					<div className="bottom-content">
						<span>下载果仁宝客户端</span>
						<span>快速提现GOP</span>
					</div>
					<a className="bottom-download" target="_blank" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.guorenbao.wallet">立即下载</a>
				</div>
			</div>
		);
	}
}

//默认属性
PaySuccess.defaultProps = {
	noHeader: true
};

/**
 * @desc context
 * @type {{history: *}}
 */
PaySuccess.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default PaySuccess;