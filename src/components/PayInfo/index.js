/**
 * @file loading
 */

'use strict';
import classNames from 'classnames';

import React from 'react';
import './index.less';

class PayInfo extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
        super(props);

    };

    makeSpaceValid(str){
        return str.split(' ').map(function(item,index){
            return item === '' ? <span key={index}>&nbsp;</span> : <span key={index}>{item}</span>;
        });
    }

    getHtml(){
        let props = this.props;
        let saleClassName = classNames({
            'login-infor-num-sale': props.payInfo.sale,
            'login-infor-num-sale-none': !props.payInfo.sale
        });
        if(props.payInfo.merName){
            var merName = this.makeSpaceValid(props.payInfo.merName);
        }
        let headImg = props.payInfo.imgsrc ? 
            (<div className="login-infor-merchant">
                <span className="login-infor-merchant-icon"><img src={props.payInfo.imgsrc} /></span>
                <span className="login-infor-merchant-name">{merName}</span>
            </div>):'';
        if(props.payInfo.type && props.payInfo.type === 'payInfo'){
            return  <div className="login-infor">
                        <div className="login-infor-protect">
                            <span className="login-infor-protect-icon"></span>
                            <span className="login-infor-protect-world">
                                您在安全的支付环境中，请放心付款
                            </span>
                        </div>
                        <div className="login-infor-num">
                            <span className="login-infor-num-rmbicom"></span>
                            <span className="login-infor-num-price">{props.payInfo.price}</span>
                            <span className={saleClassName}>
                                <span className="login-infor-num-sale-value">{props.payInfo.sale}</span>
                            </span>
                        </div>
                        { headImg}
                    </div>
        }else if(props.payInfo.type && props.payInfo.type === 'buyin'){
            return  <div className="login-infor type-buyin-infor">
                        <div className="login-infor-num type-buyin-infor-num">
                            <p className="type-buyin-infor-num-word">还需支付</p>
                            <span className="login-infor-num-rmbicom"></span>
                            <span className="login-infor-num-price">{props.payInfo.price}</span>
                            <span 
                                className="type-buyin-infor-num-help" 
                                onClick={ function(){ props.dialogShow() }.bind(this)}>
                            </span>
                        </div>
                    </div>
        }
    };

    render() {
        return (
            <div>
                { this.getHtml() }
            </div>
        );       
    }
}

PayInfo.defaultProps = {
  text: '数据加载中'
};

export default PayInfo;