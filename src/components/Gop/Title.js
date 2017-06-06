/**
 * Created by liubingli on 2017-1-19.
 */
import React from 'react';
import classNames from 'classnames';

import titleImg from './img/logo.png';
          
class GopTitle extends React.Component {
    constructor(props) {
      super(props);

    }; 

    render(){

      return(
        <h3 className="gop-title">
          <img className="gop-title-img" src={titleImg} />
          <span>果仁支付</span>
        </h3>
      );
    };
};

export default GopTitle;