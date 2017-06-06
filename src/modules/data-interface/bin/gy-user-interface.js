/**
 * @file 用户中心相关
 */

'use strict';

import { getData, postData, putData, deleteData } from './get-data';
//工具模块
import tool from './tool';
import store from 'store';
import _ from 'lodash';
import cookieObj from '../../cookie/index.js';

import { globalConfig } from '../../config';

const cookie = cookieObj.cookie;

function getGopToken() {
    // return 'b44113035b6248b092f363618d8aeb71';
    return cookie('gopToken') ? cookie('gopToken') : null;

};

// 登录  传入{ phone: 18600863085 , identifyingCode: 1111}
function login(data) {
    return postData('login/loginOrRegister', {
        data: _.extend(data, {
            phone: data.phone,
            identifyingCode: data.identifyingCode,
        })
    });
};

//手机号注册或登录获取图形验证码接口
function getCreateImage(data) {
    return getData('gop/users/getCreateImage?phone='+data.phone+'&source=0');
}

//验证图形验证码并获取验证码接口
function sendCaptcha(data) {
    return getData('gop/users/sendCaptcha?phone='+data.phone+'&source=0&imageCaptcha='+data.imageCaptcha);
}

//手机号注册或登录接口用验证验证码接口
function identifyingCode(data) {
    return postData('common/loginOrRegister/identifyingCode', {
        data: _.extend(data, {
            phone: data.phone,
            identifyingCode: data.identifyingCode,
        })
    });
}

//  获取银行卡信息 
function getBankInfo(data) {
    return postData('common/checkBankCard', {
        data: _.extend(data, {
            bankCard: data.bankCard
        })
    });
};

//  绑定银行卡 
function bindBankcard(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('bankcard/add/nocode', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};
// 发送绑定银行手机验证码   
function sendBankPhoneCode(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('unionbankpay/getDTM', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 是否实名认证
function isAuthentication(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/isCertification', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 获取实名信息
function getAuthenticationInfo(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/alreadyCertification', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 实名认证
function authentication(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/applyCertification', {
            data: _.extend(data, {
                gopToken: token,
                name: data.name,
                IDcard: data.IDcard
            })
        });
    }
};

// 获取银行卡列表 是否绑卡
function getBankcardList(data) {
    if (getGopToken()) {
        let token = getGopToken();
        console.log(token);
        return postData('bankcard/search', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 果仁不够创建买果仁订单
function creatGopBuyInOrder(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('gop/createBuyinOrder', {
            data: _.extend(data, {
                gopToken: token,
                //payType: 'UNION_BANK_PAY'
            })
        });
    }
};

// 买果仁和付款 确认支付接口
function GopCashieCnfmPay(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('pay-trade/GopCashie/CnfmPay', {
            data: _.extend(data, {
                gopToken: token
            })
        }, true);
    }
};

//支付结果查询接口
function GopCashieQueryPay(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('pay-trade/GopCashie/QueryPay', {
            data: _.extend(data, {
                gopToken: token
            })
        }, true);
    }
};

function validateUser(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('pay-trade/GopCashie/ValidateUser', {
            data: _.extend(data, {
                gopToken: token
            })
        }, true);
    }
};

function checkPayPasswordStatus(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/checkPayPasswordStatus', {
            data: _.extend(data, {
                gopToken: token,
            })
        });
    }
};

// 预支付接口
function prePay(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('pay-trade/GopCashie/PrePay', {
            data: _.extend(data, {
                gopToken: token
            })
        }, true);
    }
};

//创建订单接口
function AppHandle(data) {
        return postData('pay-trade/AppHandle', {
            data: _.extend(data, {})
        }, true);
};

//果仁牌价查询接口
function GopCashieGopPrice(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('pay-trade/GopCashie/gopPrice', {
            data: _.extend(data, {
                gopToken: token
            })
        }, true);
    }
};

//果仁订单信息查询接口
function GopCashieGetOrderInfo(data) {
    return postData('pay-trade/GopCashie/getOrderInfo', {
        data: _.extend(data, {})
    }, true);
};

//查询支付密码是否正确接口
function checkPayPwd(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/checkPayPwd', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

//果仁宝静态资源接口
function commonStatic(data){
    if(getGopToken()){
        let token = getGopToken();
        return postData('common/static', {
            data:  _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 获取用户信息手机号
function getUserInfo(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('user/info', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 找回 设置密码  发送验证码
function sentPhoneCode(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('common/user/phone/sendCode', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 找回 设置密码  校验手机验证码
function phoneIdentifyingCode(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('common/user/phone/identifyingCode', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 找回 设置密码  实名认证校验
function checkIDcard(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('security/checkIDcard', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

// 设置 找回支付密码
function setPayPassword(data) {
    if (getGopToken()) {
        let token = getGopToken();
        return postData('user/setPayPassword', {
            data: _.extend(data, {
                gopToken: token
            })
        });
    }
};

export default {
    login,
    getCreateImage,
    sendCaptcha,
    identifyingCode,
    getBankInfo,
    authentication,
    getBankcardList,
    isAuthentication,
    getAuthenticationInfo,
    bindBankcard,
    sendBankPhoneCode,
    creatGopBuyInOrder,
    GopCashieCnfmPay,
    GopCashieQueryPay,
    validateUser,
    checkPayPasswordStatus,
    prePay,
    AppHandle,
    GopCashieGopPrice,
    GopCashieGetOrderInfo,
    checkPayPwd,
    commonStatic,
    phoneIdentifyingCode,
    getUserInfo,
    sentPhoneCode,
    checkIDcard,
    setPayPassword
}
