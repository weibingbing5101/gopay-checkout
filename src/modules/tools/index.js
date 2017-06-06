/**
 * Created by wanghongguang on 16/3/8.
 */

import store from 'store';

export function getCountDown(ts, disTime, format) {
    ts = disTime ? Math.floor((ts - (Date.now() - disTime)) / 1000) : Math.floor((ts - Date.now()) / 1000);
    var day = Math.floor(ts / 86400);
    ts = ts - day * 86400;
    var hour = Math.floor(ts / 3600);
    if (hour < 10) {
        hour = '0' + hour;
    }
    ts = ts - hour * 3600;
    var minute = Math.floor(ts / 60);
    if (minute < 10) {
        minute = '0' + minute;
    }
    ts = ts - minute * 60;
    var second = ts;
    if (second < 10) {
        second = '0' + second;
    }
    switch (format) {
        case "HH:mm:ss":
            return hour + ':' + minute + ':' + second;
            break;
        case "时:分:秒":
            return (hour == '00' ? '' : (hour + '时')) + minute + '分' + second + '秒';
            break;
        default:
            return day + '天 ' + hour + ':' + minute + ':' + second;
            break;
    }
};

export function validDateFilter(dateBegin, dateEnd) {
    var dateBeginArr = dateBegin.split(" "),
        dateEndArr = dateEnd.split(" ");
    return validDay(dateBeginArr, dateEndArr);

    function getDay(day) {
        return day.replace(/-/, "年").replace(/-/, "月") + "日"
    }

    function getTime(time) {
        let timeArr = time.split(":");
        timeArr.splice(timeArr.length - 1, 1);
        return timeArr.join(":");
    }

    function validDay(dateBeginArr, dateEndArr) {
        let beginDay = getDay(dateBeginArr[0]),
            endDay = getDay(dateEndArr[0]);
        endDay = beginDay == endDay ? "" : endDay;

        let beginTime = getTime(dateBeginArr[1]),
            endTime = getTime(dateEndArr[1]);

        return beginDay + " " + beginTime + "- " + endDay + " " + endTime;
    }
};

export function priceFilter(price) {
    price = String(parseFloat(price));
    if (price.indexOf('.') < 0) {
        return ~~price;
    }
    if (price.length - price.indexOf('.') === 2) {
        return parseFloat(price).toFixed(1);
    } else {
        return parseFloat(price).toFixed(2);
    }
};

export function setDeviceId() {
    if (store.get('deviceId')) {
        return false;
    }
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");


    store.set('deviceId', uuid);

    return uuid;
};

export function getDeviceId() {
    return store.get('deviceId');
};

export function LocationSearchToJson() {
    let searchArr = window.location.href.split('?');
    searchArr = searchArr&&searchArr.length>1 ? searchArr[1].split('&') : [];
    let searchJson = {};
    if(searchArr.length){
        searchArr.forEach((val,index,arr)=>{
            if(val.split('=')[0]){
                searchJson[decodeURIComponent(val.split('=')[0])] = decodeURIComponent(val.split('=')[1]);
            }
        })
    }else{
        searchJson = null;
    }

    return searchJson;
};

export function LocationSearchJsonToUrl(json) {
    let searchStr = '';
    if(json){
        for(let name in json){
            searchStr = searchStr + name +'=' + encodeURIComponent(json[name]) +'&'; 
        }       
    }
    return searchStr;
};

export function setStrLength(str,len){
    let num=0;
    let strlen = str.length;
    for (let i = 0; i < strlen; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            num++;
        } else {
            num += 2;
        }
        if (num > len) {
            str = str.substring(0, i)+'...';
            break;
        }
    }
    return str;
};

