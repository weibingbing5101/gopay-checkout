/**
 * @file 修改密码
 */

'use strict';

import React from 'react';
import store from 'store';
//公共action
import CommonAction from '../../actions/common-action';
//用户操作action
import UserAction from '../../actions/user-action';
//用户相关store
import UserStore from '../../stores/user-store';

import { ItemList } from '../../components/wx_ItemList';
import { Button } from '../../components/Button'
import ImgLazy from '../../components/ImgLazy';
import { Link } from 'react-router';

const defaultHead = require('./img/headMan.png');
const headBgImg = require('./img/me-head-bg.png');

/**
 * @class 修改密码页面
 */
class Home extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		let userInfo = UserStore.getUserInfo();
		this.state = {
			login: userInfo&&userInfo.uid,
			userInfo: userInfo,
			unreadMsg: 0
		};
	}


	componentDidMount() {
		this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
		UserAction.unreadMessage({
			uid: UserStore.getUserInfo() ? UserStore.getUserInfo().uid : ''
		})
	}

	componentWillUnmount() {
		//this.unsubscribe();
	}

	onStoreChanged(info) {
		if(info.data){
			this.setState({
				unreadMsg: info.data.systemMessage

			});
			this.unsubscribe();
		}

	}

	logOut(){
		if(!store.get("ffan_user")){
			CommonAction.alert("失败");
			return;
		}
		UserAction.logout(store.get("ffan_user"));
		this.setState({
			login: '',
			unreadMsg: 0
		})
	}

	initTopItem(){
		let topItem = [
			{
				link: '/me/order',
				content: '我的订单',
				icon: 'icon-order',
				iconNext: true
			},{
				link: '/me/myMessage',
				content: '我的消息',
				icon: 'icon-letter',
				iconNext: true,
				sideContent: this.state.unreadMsg ? this.state.unreadMsg + '条新消息' : '',
				otherStyle: 'my-message'
			},{
			 link: '/me/ticket',
			 content: '我的票券',
			 icon: 'icon-order',
			 iconNext: true
			 },{
			 link: '/me/refunds',
			 content: '退货退款',
			 icon: 'icon-return',
			 iconNext: true
			 },{
			 link: '/me/myQueue',
			 content: '我的排队',
			 icon: 'icon-line',
			 iconNext: true
			 }
		];
		return(<ItemList data = { topItem } className="list-style"/>)
	}

	render() {
		let topItems = this.initTopItem();
		return (
			<div className="my-home">
				<div className="m-bg-grey-common">
					<div className="my-head-info">
						<div className="head-main">
							{(() => {
								console.log(!!this.state.login)
								switch (!!this.state.login) {
									case true:
										let userInfo = this.state.userInfo.member;
										let headPic = userInfo.headPortrait ? "http://img1.ffan.com/norm_680/"+userInfo.headPortrait : '';
										return (
											<div className='login-status login-status-in'>
												<div className="profile-info">
													<div className="profile">
														<a className="head-photo">
															<ImgLazy src={ headPic } defaultSrc={ defaultHead } />
														</a>
													</div>
													<div className="info">
														<p className="ellipsis">{ userInfo.nickName }</p>
														<p>欢迎来到果仁11111!</p>
													</div>
												</div>
											</div>
										);
									default: return (
										<div className="login-status login-status-out">
											<div className="profile-info">
												<div className="profile">
													<a className="head-photo">
														<img src={ defaultHead} />
													</a>
												</div>
												<div className="info">
													<p className="ellipsis">Welcome</p>
													<p>欢迎来到果仁22222!</p>
												</div>
											</div>
											<div className="btn">
												<Link to='/me/register'>注册</Link>
												<Link to='/me/login'>登录</Link>
											</div>
										</div>

									);
								}
							})()}
						</div>
						<img  className="head-bg" src={ headBgImg }  />
					</div>
					{ topItems }
					<ItemList data = { this.props.bottomItems } />

				</div>
				<div className="home-btn-wrap">
					<Button btnState={ this.state.login } className="logout-btn" onClick={ this.logOut.bind(this) }>退出登录</Button>
				</div>
			</div>
		);
	}
}

Home.defaultProps = { 
	title: '我的果仁支付',
	bottomItems: [
		{
			link: '/me/account',
			content: '账户管理',
			icon: 'icon-setmy',
			iconNext: true
		},{
			link: '/me/about',
			content: '关于果仁',
			icon: 'icon-about',
			iconNext: true
		},{
			type: 'telItem',
			content: '客服电话',
			icon: 'icon-telephone',
			iconNext: true,
			link: 'tel:400-999-9999'
		}
	]
};

export default Home;