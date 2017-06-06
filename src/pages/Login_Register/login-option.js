import React from 'react';

require('./login-option.less');

import { BtnRadius } from '../../components/Button';

//中央区域的图片
const logoImage = require('./img/logo-login-way.png');

class LoginOption extends React.Component{

  toWxLogin(){
    console.log("weixin btn")
  }

  toFfanLogin(){
    console.log("ffan btn")
  }

  render(){
    return(
      <div className="login-option-wrap">
        <div className="logo">
          <div className="logoIn"><img src={ logoImage }/></div>
        </div>
        <div className="btn-wrap">
          <BtnRadius className="btn-style btn-wx" onClick={ this.toWxLogin.bind(this) }>
            <i className="wx-icon"/><span>微信登录</span>
          </BtnRadius>
          <BtnRadius className="btn-style btn-ffan" onClick={ this.toFfanLogin.bind(this) }>果仁支付登录</BtnRadius>
        </div>
      </div>
    )
  }
}

export default LoginOption