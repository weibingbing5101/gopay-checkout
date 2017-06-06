const USER = {
  // 本地存储用户信息的key值
  LOCAL_KEY: 'ffan_user',
  TYPE: {
    MOBILE: 2
  }
}

const APPID = 'feifan';
// 渠道号
const CHANNEL = 1;
// 校验验证码的类型
const VC_TYPE = {
  REGISTER: 1,
  GORGETPWD: 3
};
// v1的地址
const v1_HOSTNAME = location.origin + '/';
const v1_HOST =  v1_HOSTNAME + '#';

export default {
  USER,
  APPID,
  CHANNEL,
  VC_TYPE,
  v1_HOST,
  v1_HOSTNAME
}