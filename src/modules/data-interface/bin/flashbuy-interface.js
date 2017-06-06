'use strict';

import { getData } from './get-data';

export default {
  getScreenings,
  getGoods
}

/**
 * @description 获取活动的列表
 * @param  {city}
 * @return {[]}
 */
export function getScreenings(data){
  let city = data.data.city||'110100';	
  return getData(`flashsale/v1/cities/${city}/screenings`,{
    data:data
  });
}

/**
 * @description 获取闪购商品信息
 * @param  {id,acid...}
 * @return {}
 */
export function getGoods(data){
  return getData('flashsale/v4/goods',{
    data:data
  });
}