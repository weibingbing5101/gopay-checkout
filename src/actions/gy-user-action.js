/**
 * @file 用户功能action
 */

'use strict';

import Reflux from 'reflux';
//数据请求模块
import { GYUserInterface } from '../modules/data-interface';

//跟用户相关的操作都放在这里
const GYUserAction = Reflux.createActions(
    [{
        'login': { children: ['completed', 'failed'] }
    },{
        'getCreateImage':{children:['completed','failed']}
    }, {
        'sendCaptcha':{children:['completed','failed']}
    },{
        'identifyingCode': { children: ['completed', 'failed'] }
    }, {
        'getBankInfo': { children: ['completed', 'failed'] }
    }, {
        'getBankcardList': { children: ['completed', 'failed'] }
    }, {
        'isAuthentication': { children: ['completed', 'failed'] }
    }, {
        'authentication': { children: ['completed', 'failed'] }
    }, {
        'getAuthenticationInfo': { children: ['completed', 'failed'] }
    }, {
        'bindBankcard': { children: ['completed', 'failed'] }
    }, {
        'creatGopBuyInOrder': { children: ['completed', 'failed'] }
    }, {
        'GopCashieCnfmPay': { children: ['completed', 'failed'] }
    }, {
        'GopCashieQueryPay': { children: ['completed', 'failed'] }
    }, {
        'validateUser': { children: ['completed', 'failed'] }
    }, {
        'checkPayPasswordStatus': { children: ['completed', 'failed'] }
    }, {
        'prePay': { children: ['completed', 'failed'] }
    }, {
        'AppHandle': { children: ['completed', 'failed'] }
    }, {
        'GopCashieGopPrice': { children: ['completed', 'failed'] }
    }, {
        'GopCashieGetOrderInfo': { children: ['completed', 'failed'] }
    }, {
        'phoneIdentifyingCode': { children: ['completed', 'failed'] }
    }, {
        'getUserInfo': { children: ['completed', 'failed'] }
    }, {
        'checkIDcard': { children: ['completed', 'failed'] }
    }, {
        'checkPayPwd': { children: ['completed', 'failed'] }
    }, {
        'commonStatic': { children: ['completed', 'failed'] }
    }]
);

/**
 * @desc 登录操作
 */
GYUserAction.login.listen(function(data) {
    GYUserInterface.login(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});
/**
 * @desc 获取图形验证码
 */
GYUserAction.getCreateImage.listen(function(data){
    GYUserInterface.getCreateImage(data)
        .then(function(result){
            this.completed(result);
        }.bind(this))
        .fail(function(msg,result){
            this.failed(msg,result);
        }.bind(this))
});
/**
 * @desc 验证图形验证码，并获取验证码
 */
GYUserAction.sendCaptcha.listen(function(data){
    GYUserInterface.sendCaptcha(data)
        .then(function(result){
            this.completed(result);
        }.bind(this))
        .fail(function(msg,result){
            this.failed(msg,result);
        }.bind(this))
});
/**
 *@desc 验证验证码是否正确
 */
GYUserAction.identifyingCode.listen(function(data) {
    GYUserInterface.identifyingCode(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});
/**
 * @desc 获取银行卡信息
 */
GYUserAction.getBankInfo.listen(function(data) {
    GYUserInterface.getBankInfo(data)
        .then(function(result) {
            result && result.data ? result.data.cardNo = data.bankCard : '';
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

/**
 * @desc 获取银行卡列表  是否绑定银行卡
 */
GYUserAction.getBankcardList.listen(function(data) {
    GYUserInterface.getBankcardList(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

/**
 * @desc 绑定银行卡
 */
GYUserAction.bindBankcard.listen(function(data) {
    GYUserInterface.bindBankcard(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});


/**
 * @desc 是否实名认证
 */
GYUserAction.isAuthentication.listen(function(data) {
    GYUserInterface.isAuthentication(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});
/**
 * @desc 实名认证
 */
GYUserAction.authentication.listen(function(data) {
    GYUserInterface.authentication(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});
/**
 * @desc 获取认证信息
 */
GYUserAction.getAuthenticationInfo.listen(function(data) {
    GYUserInterface.getAuthenticationInfo(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});


// 果仁不够 创建买果仁订单
GYUserAction.creatGopBuyInOrder.listen(function(data) {
    GYUserInterface.creatGopBuyInOrder(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

// 买果仁和付款 确认支付接口
GYUserAction.GopCashieCnfmPay.listen(function(data) {
    GYUserInterface.GopCashieCnfmPay(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

GYUserAction.GopCashieQueryPay.listen(function(data) {
    GYUserInterface.GopCashieQueryPay(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

//支付限额接口
GYUserAction.validateUser.listen(function(data) {
    GYUserInterface.validateUser(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

//用户支付状态接口
GYUserAction.checkPayPasswordStatus.listen(function(data) {
    GYUserInterface.checkPayPasswordStatus(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

// 预支付  接口
GYUserAction.prePay.listen(function(data) {
    GYUserInterface.prePay(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

//创建订单接口
GYUserAction.AppHandle.listen(function(data) {
    GYUserInterface.AppHandle(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

//果仁牌价查询接口
GYUserAction.GopCashieGopPrice.listen(function(data) {
    GYUserInterface.GopCashieGopPrice(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

//果仁订单信息查询接口
GYUserAction.GopCashieGetOrderInfo.listen(function(data) {
    GYUserInterface.GopCashieGetOrderInfo(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});


//查询支付密码是否正确接口
GYUserAction.checkPayPwd.listen(function(data) {
    GYUserInterface.checkPayPwd(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});


//果仁宝静态资源接口
GYUserAction.commonStatic.listen(function(data) {
    GYUserInterface.commonStatic(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

// 找回 设置密码  手机验证码校验
GYUserAction.phoneIdentifyingCode.listen(function(data) {
    GYUserInterface.phoneIdentifyingCode(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});


// 获取用户信息手机号 姓名等 
GYUserAction.getUserInfo.listen(function(data) {
    GYUserInterface.getUserInfo(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});

// 找回 设置密码  实名认证校验
GYUserAction.checkIDcard.listen(function(data) {
    GYUserInterface.checkIDcard(data)
        .then(function(result) {
            this.completed(result);
        }.bind(this))
        .fail(function(msg, result) {
            this.failed(msg, result);
        }.bind(this))
});
export default GYUserAction;
