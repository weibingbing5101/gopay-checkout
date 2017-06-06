'use strict';

import store from 'store';
import dateformat from 'dateformat';
import { devHost, onlineHost, h5DevHost, onlineH5Host } from '../../modules/data-interface/bin/config';

const host = process.env.DEBUG ? devHost : onlineHost;
console.log(host)

const tracking= function (event_id,obj) {
  console.log(event_id)
  send(event_id, obj)
};

var TrackingService = {};

var content = {
  "u_uid": "",
  "browser_type": t_getBrowserType(),
  "os_version": t_detectOS(),
  "browser_ver": window.navigator.appVersion || '',
  "event_log":[
    {}
  ]
};

/**
 *
 * @param event_id
 * @param flag (true:uv false:pv)
 * @param obj  (额外的参数)
 */
function send(event_id, obj ) {
  t_uniqueU();
  content.u_uid=t_getCookie("U_UID");
  var eventLog=content.event_log[0];
  eventLog.event_id=event_id;
  eventLog.plaza_id=store.get("plazaId");
  eventLog.city_id=store.get("cityId");
  eventLog.event_time=dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
  eventLog.promotion_from=getPromotionFrom();
  if(obj){
    for (var key in obj) {
      eventLog[key] = obj[key]
    }
  }
  //var url = CONFIG.SERVER_HOST + "/ffan/v2/appstatlog?";
  var url = host + "/ffan/v1/mxlog?";
  url += "content=" + JSON.stringify(content) + "&type=50";
  //console.log(url);
  var oImg=new Image();
  oImg.src=url;
  oImg=null;
  content.event_log[0]={};
}

function getPromotionFrom(){
  var refer={},
    date=new Date().getTime();
  if(localStorage.getItem("refer")){
    refer=JSON.parse(localStorage.getItem("refer"));
    if(date>=refer.expired){
      localStorage.removeItem("refer");
      return ""
    }
    return refer.promotion_from
  }
  return ""
}

function t_getBrowserType(){
  var u = navigator.userAgent, app = navigator.appVersion;
  if (u.indexOf("Trident") > -1) {
    return "trident";       //IE内核
  }
  if (u.indexOf("Presto") > -1) {
    return "Presto";     //opera内核
  }
  if (u.indexOf("AppleWebKit") > -1) {
    return "webKit";   //苹果、谷歌内核
  }
  if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
    return "gecko";      //火狐内核
  }
  if (!!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/)) {
    return "mobile";      //移动终端
  }
  if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return "ios";   //ios终端
  }
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return "android";   //android终端或者uc浏览器
  }
  if (u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1) {
    return "iPhone";   //iphne或QQHD浏览器
  }
  return "other";
}
function t_detectOS(){
  var sUserAgent = navigator.userAgent.toLowerCase();
  var isWin = (navigator.platform.toLowerCase() === "win32") || (navigator.platform.toLowerCase() === "windows");
  var bIsIpad = sUserAgent.indexOf('ipad') != -1;
  var bIsIphoneOs = sUserAgent.indexOf('iphone') != -1 || sUserAgent.indexOf('ios') != -1;
  var isUnix = (navigator.platform.toLowerCase() === 'x11') && !isWin && !isMac;
  var isLinux = (String(navigator.platform.toLowerCase()).indexOf("linux") > -1);
  var bIsAndroid = sUserAgent.indexOf('android') != -1;
  var bIsCE = sUserAgent.indexOf('windows ce') != -1;
  var bIsWM = sUserAgent.indexOf('windows mobile') != -1;

  if (bIsAndroid) {
    return "Android";
  }
  if (bIsIpad) {
    return "Ipad";
  }
  if (bIsIphoneOs) {
    return "Iphone";
  }
  if (isUnix) {
    return "Unix";
  }
  if (isLinux) {
    return "Linux";
  }
  if (bIsCE || bIsWM) {
    return 'wm';
  }

  return "other";
}
function t_formatDate(date,fmt){
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
function t_getUrlParam(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}
function t_getCookie(name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  // fix to no-cond-assign
  arr=document.cookie.match(reg);
  if(arr)
    return unescape(arr[2]);
  else
    return "";
}
function t_uniqueU(){
  if(t_getCookie('U_UID')){
    return;
  }
  var expireDate=new Date();
  expireDate.setDate(expireDate.getDate()+1);
  expireDate.setHours(0);
  expireDate.setMinutes(0);
  expireDate.setMilliseconds(0);
  expireDate.setSeconds(0);
  document.cookie = 'U_UID' + "="+ uuid() + ";expires=" + expireDate.toUTCString();

  function uuid(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
}

export default tracking;

