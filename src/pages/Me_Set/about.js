'use strict';

import React from 'react';

import Header from '../../components/Header/header';
import { BtnRadius } from '../../components/Button';

//中央区域的图片
const logoImage = require('./img/aboutffan-logo.png');

class About extends React.Component {

  constructor(props){
    super(props);
  }

  toIntroduce(){
    window.location = window.location.origin + '/view/introduce.html';
  }
  toAgreement(){
    window.location = window.location.origin + '/view/agreement.html';
  }

  render() {
    return (
        <div className="m-bg-grey">
          <div className="my-floor-txtcenter logo">
            <img src={ logoImage } />
          </div>
          <div className="btn-wrap">
            <div>
              <BtnRadius className="btn-about" onClick={ this.toIntroduce }>果仁支付会员介绍</BtnRadius>
            </div>
            <div>
              <BtnRadius className="btn-about" onClick={ this.toAgreement }>果仁支付会员协议</BtnRadius>
            </div>
          </div>
        </div>
    );
  }

}

About.defaultProps={
  title: '关于果仁支付'
};

export default About;
