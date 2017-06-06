/**
 * @file 由于注册和登录功能容器一致 因此统一使用这个容器
 */

'use strict';

import React from 'react';

require('./container.less');

//中央区域的图片
const logoImage = require('./img/logo-login.png');


/**
 * @desc 个人中心注册登录页面
 * @param props
 * @returns {XML}
 * @constructor
 */
const Container = (props) => {
	return (
			<div className="me-login-content">
				<section className="m-main-content">
					<div className="logo-content">
						<img src={ logoImage } />
					</div>
					<div className="form-content">
						{ props.children }
						<dl className="prompt-show">
							<dt>温馨提示：</dt>
							<dd>1.如果您曾经连接过万达广场WIFI，则默认已经是果仁支付会员，可直接登录。</dd>
							<dd>2.登录密码短信已在WIFI连接成功后发送到您的手机上，如果忘记请点击"忘记密码"找回。</dd>
						</dl>
					</div>
				</section>
			</div>
	);
}

export default Container;