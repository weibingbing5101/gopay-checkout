/**
 * @file loading
 */

'use strict';

import React from 'react';
import './index.less';

const successMark = require('./img/gf_q.png');

class GopPrice extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
        super(props);
    };

    getHtml(){

        if(this.props.gopInfo.type && this.props.gopInfo.type === 'page_isenough'){
            return  <div className="gop-infor">
                        <p 
                            className="gop-infor-curprict"
                        >
                            GOP当前卖出价
                            <img className="gop-infor-img" src={ successMark } />
                            { this.props.gopInfo.curprict }
                        </p>
                    </div>
        }else if(this.props.gopInfo.type && this.props.gopInfo.type === 'page_buy'){
            return  <div className="gop-infor">
                        <p className="gop-infor-curprict">GOP当前买入价<img className="gop-infor-img" src={ successMark } />{ this.props.gopInfo.curprict }</p>
                        <p className="gop-infor-buynum">预计买入 <span className="blueG">{ this.props.gopInfo.buynum }</span></p>
                        <p></p>
                    </div>
        }
    };

    render() {
        return (
            <div>
                {this.getHtml()}
            </div>
        );       
    }
}





GopPrice.defaultProps = {
  text: '果仁价格'
};

export default GopPrice;