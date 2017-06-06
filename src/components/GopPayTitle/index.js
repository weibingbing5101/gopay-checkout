/**
 * @file loading
 */

'use strict';

import React from 'react';
import './index.less';
import BackBtn from '../BackBtn/back-btn.js';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';


class GopPayTitle extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
        super(props);
    };

    getHtml(){
        
    };

    render() {
        let loginPage;
        let backMethod = this.props.backMethod;
        if (!window.backObj && backMethod) {
            backMethod = function() {
                this.context.history.pushState(null,'/create_order');
            }.bind(this)          
        }
        //payCompleted   表示支付完成后的显示关闭按钮
        if (backMethod && this.props.payCompleted) {
            loginPage = (<span className='close-btn' onClick={backMethod}></span>);
        }else if (backMethod) {
            loginPage = (<a className='back-btn' onClick={backMethod}><i className="iconfont icon-back"></i></a>);
        }else {
            loginPage = (<BackBtn></BackBtn>);
        }

        return (
            <div className="gop-pay-title">
                <span className="title-btn">
                    {loginPage}
                </span>
                <span className="title-name">{this.props.title}</span>    
            </div>
        );       
    }
}





GopPayTitle.defaultProps = {
    text: '果仁支付',
    title:'果仁支付'
};

GopPayTitle.contextTypes = {
    history: PropTypes.history
}
export default GopPayTitle;