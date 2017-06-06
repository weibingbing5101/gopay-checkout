/**
 * @file loading
 */

'use strict';

import React from 'react';
import './index.less';

class UserGopInfo extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div className="usergopinfo">
                <p className='paygopnum'>
                    <span>需支付</span>
                    <span className="blackG">{this.props.userGopInfo.payGopNum}</span>
                </p>
                <p className='usergopnum'>
                    <span className="blueG">{this.props.userGopInfo.userGopNum}</span>
                    <span>账户现有果仁数 </span>
                </p>
            </div>
        );       
    }
}

UserGopInfo.defaultProps = {
  text: '用户GOP信息'
};

export default UserGopInfo;