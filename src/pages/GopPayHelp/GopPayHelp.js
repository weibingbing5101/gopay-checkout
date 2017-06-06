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

import Help from '../Help';
import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';


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
		this.searchJson = LocationSearchToJson();
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
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
		this.context.history.goBack();
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<div className="pay-help-title">
					<span className="title-btn" onClick={function(){this.closeHelp()}.bind(this)}>
                	</span>
                	<span className="title-name">帮助</span> 
				</div>
				<Help></Help>

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