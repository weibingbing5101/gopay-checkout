import React from 'react';

import ImgLazy from '../../components/ImgLazy';
import { Link } from 'react-router';

const star1=require('./img/star_k.png');
const star2=require('./img/star_b.png');

class LefuListItem extends React.Component{

  parseTemplate (str) {
    str = str.replace(/<font (.*?)>/g, '');
    str = str.replace(/<style(.*?)>/g, '');
    str = str.replace(/face=__dyh__(.*?)__dyh__/g, '');
    str = str.replace(/size=__dyh__(.*?)__dyh__/g, '');
    str = str.replace(/color=__dyh__(.*?)__dyh__/g, '');
    str = str.replace(/__dyh__/g, '');
    str = str.replace(/__fxg__/g, '');
    str = str.replace(/<font>/g, '');
    return str;
  };

  displayScore(scored){
    let allScore = 5;
    let stars=[];
    for(let i=0;i<scored;i++){
      stars.push(<img key={ i } src = { star2 }  />)
    }
    for(let i=0;i<allScore-scored;i++){
      stars.push(<img key={ scored+i } src = { star1 }  />)
  }
    return stars
  }

  displayStoreRule(storeRules){
    let rules=[];
    if(storeRules){
      storeRules.map( (rule, index ) => {
        rules.push(
          <div key = { index }>
            <i className="icon-pay"></i>
            <span className="rule">{ rule.promotionName }</span>
            <span className="tip">{ rule.promotionMaxMinus }</span>
          </div>
        );
      })
    }
    return rules;
  }

  render(){
    let props = this.props;
    let item = props.data;

    let titleIcons = item.imgs.map(function (img, index) {
      return(
        <img src={ img } key={ index }/>
      );
    });

    let pic = props.imgHost + item.icon;

    let href = 'merchant/'+item.product_id;

    let handleClick= function () {
      this.props.onClick && this.props.onClick(item.product_id)
    }

    return(
      <div className="list-item" onClick={ handleClick.bind(this) }>
        <div className="list-cont">
          <div className="img-area">
            <img src={ pic }   />
          </div>
          <div className="cont-area">
            <p>
              <span className="tit">{ this.parseTemplate(item.title1) }</span>
              <span className="icons">
                { titleIcons }
              </span>
            </p>
            <p className="stars">
              { this.displayScore(item.averageScore_d) }
            </p>
            <p className="tags">
              <span>{ this.parseTemplate(item.title2) }</span>
              <span className="loc">F{ item.store_z }层-{ item.storeBunkNo_ss[0] }</span>
            </p>
          </div>
        </div>
        <div className="list-bottom">
          { this.displayStoreRule(item.storeRule) }

        </div>
      </div>
    )
  }
}

//TODO:IMGLAZA defaultSrc
LefuListItem.defaultProps = {
  imgHost: "http://img1.ffan.com/norm_120/"
};

export default LefuListItem;