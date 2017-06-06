/**
 * @file 放一些页面的公共部分，比如loading、alert
 */

'use strict';

import React from 'react';
import Alert from '../../components/Alert/alert';
import Loading from '../../components/Loading/loading';
import Header from '../../components/Header/header';
import $ from 'jquery';

//公共action
import CommonAction from '../../actions/common-action';
//公共store
import CommonStore from '../../stores/common-store';

import { setDeviceId } from '../../modules/tools';

import GopPayTitle from '../../components/GopPayTitle';


const ALERT_EXPIRE = 1000;

class Common extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			alertText: '',
			alertTimer: null,
			loadingText: '',
			loadingShow: false
		}

		setDeviceId();

		this.init();
	} 

	init(){
		//判断是否在微信打开
		var ua = window.navigator.userAgent.toLowerCase(); 
		// alert(ua);
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			this.appIsHaveHeader = true;
		}else{  
			this.appIsHaveHeader = false;
		} 
	}

	componentDidMount() {
		this.unsubscribeAlert = CommonStore.listenTo(CommonAction.alert, this.onAlert.bind(this));
		this.unsubscribeLoading = CommonStore.listenTo(CommonAction.loading, this.onLoading.bind(this));
		this.unsubscribeUpdateTitle = CommonStore.listenTo(CommonAction.updateTitle, this.onUpdateTitle.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribeAlert instanceof Function&&this.unsubscribeAlert();
		this.unsubscribeLoading instanceof Function&&this.unsubscribeLoading();
		this.unsubscribeUpdateTitle instanceof Function&&this.unsubscribeUpdateTitle();
	}

	clearAlert(){
		const state = this.state;
		if(state.alertTimer){
			this.setState({
				alertText: ''
			});
			clearTimeout(state.alertTimer);
			state.alertTimer = null;
		}
	}

	clearLoading(){
		this.setState({
			loadingShow: false
		})
	}

	onLoading(show, text){
		this.setState({
			loadingShow: show,
			loadingText: text
		});

		this.clearAlert();

	}

	onAlert(data, low) {
		this.setState({
			alertText: data,
            alertLow: low
		});

		if(data){

			const state = this.state;

			if(state.alertTimer){
				clearTimeout(state.alertTimer);
				state.alertTimer = null;
			}

			state.alertTimer = setTimeout(this.clearAlert.bind(this), ALERT_EXPIRE);
		}
	}

	onAlertChanged(state){
		this.setState({
			alertText: ''
		});
	}

	scanTitle(props){
		let title = '果仁支付';
		while(props){
			if(props.title){
				title = props.title;
				break;
			}
			props = (props&&props.children&&props.children.props);
		}
		this.onUpdateTitle(title)
	}

	scanChildProps(key){
		let props = this.props;
		while(props){
			if(props[key]){
				return props[key];
			}
			props = (props&&props.children&&props.children.props);
		}
		return null;
	}

	onUpdateTitle(title){
		$('head title').text(title);
	    //微信iOS下改变页面title
	    let $body = $('body');
	    var $iframe = $('<iframe src="/favicon.ico" style="display:none;"></iframe>').on('load', function() {
	     setTimeout(function() {
	       $iframe.off('load').remove();
	     }, 0)
	    }).appendTo($body);
	}

	render() {
		const props = this.props;
		this.scanTitle(props);
		let backMethod = this.scanChildProps('backMethod');
		let noHeader = this.scanChildProps('noHeader');
		let headerTitle = '果仁支付';//  header的名称
		if (this.scanChildProps('headerTitle')) {
			headerTitle = this.scanChildProps('headerTitle');
		}
		let header = '';
		if (this.appIsHaveHeader) {
			if (this.scanChildProps('appNeedTitle')) {
				header = <GopPayTitle title={headerTitle} backMethod={ backMethod }></GopPayTitle>;
			}
		}else{
			header = noHeader?"":<GopPayTitle title={headerTitle} backMethod={ backMethod }></GopPayTitle>;
		}
		//let header = noHeader?"":<GopPayTitle title={headerTitle} backMethod={ backMethod }></GopPayTitle>;
		return (
			<div className='page'>
				{header}
				{ props.children }
				<Alert low={this.state.alertLow} text={ this.state.alertText } callbackParent={ this.onAlertChanged.bind(this) } />
				<Loading text={ this.state.loadingText } show={ this.state.loadingShow } onClick={ this.clearLoading.bind(this) } />
			</div>
		);
	}
};


export default Common;