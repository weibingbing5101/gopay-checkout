const DEFAULT_PAGETITLE = '乐付买单';
const MONEY_ERROR = {
    'MONEY_INVALID': '请输入正确的金额',
    'MONEY_NULL': '请输入消费金额',
    'MONEY_LIMIT_SMALL': '金额最小为1分钱',
    'MONEY_LIMIT_MAX': '金额最大为',
    'MONEY_LIMIT_DECIMAL': '小数点后最多2位'
}
const RULE_ERROR = {
    //达到了门店每天的优惠次数
    '101': '很遗憾，门店今天该优惠被抢光了',
    //达到了用户当天的限购次数
    '102': '亲，您今天的优惠次数用完了哟！',
    //达到了用户在活动期间的限购次数
    '103': '亲，您的优惠次数已全部用完！',
    //不满足满减优惠条件
    '104': '不能使用当前优惠规则',
    //默认提示
    '-1': '不能使用当前优惠规则'
}

const TRADE_CODE = 7030;

export default {
  TRADE_CODE,
  DEFAULT_PAGETITLE,
  MONEY_ERROR,
  RULE_ERROR
}