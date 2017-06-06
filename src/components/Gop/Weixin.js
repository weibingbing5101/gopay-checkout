/**
 * Created by liubingli on 2017-1-19.
 */
import React from 'react';
import classNames from 'classnames';

import weixinImg from './img/weixin.png';

class GopWeixin extends React.Component {
    constructor(props) {
      super(props);

    }; 

    render(){
      return(
        <div className="gop-weixin">
          <p>
            <img className="gop-weixin-img" src={weixinImg} />
          </p>
          <div>
            <p>关注果仁宝公众号</p>
            <p>获取更多福利</p>
          </div>
        </div>
      );
    };
};

export default GopWeixin;