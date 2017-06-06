/**
 * Created by dell on 2016-1-29.
 */
'use strict';

import { getData } from './get-data';

export default {
  merchantDetail,
  merchantIntroduction,
  couponDetail
}

function merchantDetail(data){
  return getData('app/merchant',{
    data:data
  },true)
}

function merchantIntroduction(data){
  return getData('app/merchantintroduction',{
    data:data
  },true)
}

function couponDetail(){

}