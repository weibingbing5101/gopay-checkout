/**
 * Created by dell on 2016-1-29.
 */
import React from 'react';

import { DefaultItem, TelItem } from './item-main';

require('./item-list.less');

/**
 * icon:图标class;
 content:中间内容;
 iconNext:是否有右箭头;
 sideContent:是否有右侧小字;
 clickAction/link:点击后的动作;
 otherStyle:item的className 背景-目前乐付list有用到
 */

class ItemList extends React.Component{
  render(){
    const data=this.props.data;

    let listStyle=this.props.className?'m-item-list '+this.props.className:'m-item-list';
    let itemTitle=this.props.itemTitle;
    let showTitle={
      display:itemTitle?"block":"none"
    };

    let itemList=data.map( (item, index) => {
      let itemStyle=item.otherStyle?"item "+item.otherStyle:"item";
      return(
        <dd key={ index } className={ itemStyle }>
          {
            (() => {
              switch (item.type){
                case 'telItem':
                  return(
                    <TelItem data={ item } ></TelItem>
                  );
                  break;
                case 'default':
                default :
                  return(
                    <DefaultItem data={ item }  ></DefaultItem>
                  );
              }
            })()
          }
        </dd>
      )

    } );

    return(
      <div>
        <dl className={ listStyle }>
          <dt className="item-tit"  style={ showTitle }>{ itemTitle }</dt>
          { itemList }
        </dl>
      </div>
    )
  }
}

export default ItemList