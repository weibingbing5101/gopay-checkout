/**
 * @file 获取数据模块
 */

'use strict';

import $ from 'jquery';

import { host } from './config';

import tool from './tool';

import store from 'store';



//根据编译的线上线下环境切换url
var requestHost = host[process.env.NODE_ENV]['host']; // 果仁宝地址
var h5host = host[process.env.NODE_ENV]['h5Host'];    // 果付地址

const addMember = (requestData) => {
    ['data', 'params'].forEach((addKey) => {
        var obj = requestData[addKey];
        if (obj && obj.memberId) {
            let memberIdKey = obj.memberId;
            if (typeof memberIdKey === 'boolean') {
                memberIdKey = 'memberId';
            }
            delete obj.memberId;
            obj[memberIdKey] = store.get('ffan_user').uid;
        }
    });
}

/**
 * 设置默认的content-type为application/json
 * @param  {[type]} requestData [description]
 * @return {[type]}             [description]
 */
const fixContentType = function(requestData,isH5Host) {
    let headers = requestData.headers;
    if (!headers) {
        if (isH5Host) {
            requestData.headers = {
                'Content-Type': 'application/json'
            }
        }
        // requestData.headers = {
        //     'Content-Type': 'application/json'
        // }
        requestData.data = JSON.stringify(requestData.data);
    } else {
        if (!headers['Content-Type']) {
            if (isH5Host) {
                headers['Content-Type'] = 'application/json';
            }
            // headers['Content-Type'] = 'application/json';
            requestData.data = JSON.stringify(requestData.data);
        }
    }
}

/**
 * @method getData
 * @desc 获取数据
 * @param url {String} 请求方法
 * @param opts {Object} 请求额外参数,如header
 * @param isH5Host {boolean} 是否是h5 host
 * @returns {*}
 */
const getData = (url, opts = { method: 'GET' }, isH5Host = false) => {
    var deferred = $.Deferred(),
        requestData = $.extend({
            success(response) {

                if(isH5Host){   // 果付请求
                    if (response.returnCode == '000000') {
                        deferred.resolve(response || {});
                    } else {
                        deferred.reject(response.returnMsg, response);
                    }
                }else{          // 果仁宝请求
                    response = JSON.parse(response);
                    if (response.status == 200) {
                        deferred.resolve(response || {});
                    } else {
                        deferred.reject(response.msg, response);
                    }
                }
            },
            cache: false,
            crossDomain: true,
            //dataType: 'json',
            // xhrFields: { withCredentials: isH5Host ? false : !process.env.DEBUG },
            fail() {
                deferred.reject('请求出错,请稍后重试');
            }
        }, opts);
    fixContentType(requestData,isH5Host);
    url = isH5Host ? h5host + url : requestHost + url;
    addMember(requestData);
    if (requestData.params) {
        let params = requestData.params;
        url += url.indexOf('?') > -1 ? '&' : '?';
        url += tool.formatData(params);
    }
    $.ajax(url, requestData);
    return deferred.promise();
};

/**
 * @method postData
 * @desc 提交数据
 * @param url {String} 请求方法
 * @param opts {Object} 请求的额外参数
 * @returns {*}
 */
const postData = (url, opts = {}, isH5Host) => {
    console.log(isH5Host);
    opts.method = 'POST';
    return getData(url, opts, isH5Host);
}

/**
 * @method putData
 * @desc 提交数据
 * @param url {String} 请求方法
 * @param opts {Object} 请求的额外参数
 * @returns {*}
 */
const putData = (url, opts = {}, isH5Host) => {
    opts.method = 'PUT';
    return getData(url, opts, isH5Host);
};

const deleteData = (url, opts = {}, isH5Host) => {
    opts.method = 'DELETE';
    return getData(url, opts, isH5Host)
}

export { getData };
export { postData };
export { putData };
export { deleteData }





// 处理promise超时的请求情况

// var http = require('http');
// var url = require('url');

// function get(addr) {  
//   return new Promise(function(resolve, reject) {
//     var url_obj = url.parse(addr);
//     var options = {
//       hostname: url_obj.hostname,
//       path: url_obj.path,
//       method: 'GET'
//     };

//     var req = http.request(options, function(res) {
//       res.setEncoding('utf8');

//       var data = '';
//       res.on('data', function (chunk) {
//         data += chunk;
//       });
//       res.on('end', function () {
//         data = JSON.parse(data);
//         resolve(data);
//       });
//     });

//     req.on('error', function(e) {
//       reject(e)
//     });
//     req.end();
//   });
// }

// get('http://demos.so/result/homework.promise.userInfo').then(function (args) {
//   return Promise.all([get('http://demos.so/result/userid=' + args['_id']), get('http://demos.so/result/student=' + args['_id'])]);
// }).then(function (args) {
//   console.log(args);
// }).catch(function(err){
//   console.log(err);
// });


// var http = require('http');
// var url = require('url');

// function delayPromise(ms) {
//     return new Promise(function (resolve) {
//         setTimeout(resolve, ms);
//     });
// }
// function timeoutPromise(promise, ms) {
//     var timeout = delayPromise(ms).then(function () {
//             throw new Error('Operation timed out after ' + ms + ' ms');
//         });
//     return Promise.race([promise, timeout]);
// }

// function get(addr) {  
//   return new Promise(function(resolve, reject) {
//     var url_obj = url.parse(addr);
//     var options = {
//       hostname: url_obj.hostname,
//       path: url_obj.path,
//       method: 'GET'
//     };

//     var req = http.request(options, function(res) {
//       res.setEncoding('utf8');

//       var data = '';
//       res.on('data', function (chunk) {
//         data += chunk;
//       });
//       res.on('end', function () {
//         data = JSON.parse(data);
//         resolve(data);
//       });
//     });

//     req.on('error', function(e) {
//       reject(e)
//     });
//     req.end();
//   });
// }


// timeoutPromise(get('http://demos.so/result/homework.promise.userInfo'),1000).catch(function (err) {
//   console.log(err);
// }).then(function (args) {
//   return Promise.all([timeoutPromise(get('http://demos.so/result/userid=' + args['_id']), 1000), timeoutPromise(get('http://demos.so/result/student=' + args['_id']), 1000)]);
// }).then(function (args) {
//   console.log(args);
// }).catch(function (err) {
//   console.log(err);
// });














