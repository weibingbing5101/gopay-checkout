'use strict';

import { getData } from './get-data';

export default {
  getScore
}

function getScore(data){
  return getData('v1/comment/reviewObjects/' + data.reviewObjectId ,{
    data: data.params
  })
}

