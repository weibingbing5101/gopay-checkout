/**
 * Created by dell on 2016-2-2.
 */
import React from 'react';
import Dialog from '../Dialog/dialog';

require('./index.less');

class Confirm extends React.Component {
    cancelAction (e) {
        e.preventDefault();
        this.props.cancel && props.cancel();
        this.props.callbackParent();
    };
    submitAction () {
        this.props.submit();
    }; 
    render(){
        let btnDom = null;
        this.childrenLen = 0;
        let props=this.props;
        let confirmTitle= props.confirmContent;
        let confirmContent = '';
        // let confirmTitle= props.confirmTitle;
        // let confirmContent= props.confirmContent;
        let btnCencle="取消";
        let btnConfirm="确定";

        let btnLength = 2;

        let childrenArr = [];

        if(!Array.isArray(props.children) && props.children){
            childrenArr.push(props.children);
            this.childrenLen = btnLength = childrenArr && childrenArr.length;
        }else{
            this.childrenLen = btnLength=props.children && props.children.length;
        }
        switch (btnLength){
          case 1:
            btnCencle=childrenArr[0].props.children;
            btnConfirm="";
            break;
          case 2:
            btnCencle=props.children[0].props.children;
            btnConfirm=props.children[1].props.children;
            break;
          default :
            break;
        };

        if(this.childrenLen===1){
            btnDom = <button className="confirm-item confirm-cancel only-one-cancel" onClick={ (e)=>{ this.cancelAction(e)} }>{ btnCencle }</button>
        }else{
            btnDom = <div>
                <button className="confirm-item confirm-cancel" onClick={ (e)=>{ this.cancelAction(e)} }>{ btnCencle }</button>
                <button className="confirm-item" onClick={ (e)=>{ this.submitAction(e) } }>{ btnConfirm }</button>
            </div>
        }
            return(
            <div>
                <div className="dialog-mask" onClick={ (e)=>{ this.cancelAction(e) } }></div>
                <div className="dialog-confirm">
                    <div className="confirm-title">
                        <p>{ confirmTitle }</p>
                    </div>
                    <div className="confirm-content">
                        <p>{ confirmContent }</p>
                    </div>
                    <div className="confirm-btn">
                        {btnDom}                
                    </div>
                </div>
            </div>
        );
    };
};

export default Confirm;