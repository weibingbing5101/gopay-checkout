/**
 * @file loading
 */

'use strict';

import React from 'react';

require('./index.less');

class BottomTips extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
        super(props);
        this.tips = {
            '0':['果仁价格，随市场交易情况波动','以最终成交价为准']
        }[this.props.bottomtips];
        
    };

    render() {
        return (
            <div className="bottomtips">
                <p>{ this.tips[0] }</p>
                <p>{ this.tips[1] }</p>
            </div>
        );       
    }
}
BottomTips.defaultProps = {
  text: '底部提示'
};

export default BottomTips;