/**
 * Created by dell on 2016-2-2.
 */
import React from 'react';
import classNames from 'classnames';

require('./index.less');

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }; 

    render(){
        let btnDom = null;
        this.childrenLen = 0;
        let props= this.props;

        let btnCencle= this.props.btnCencle ? this.props.btnCencle : "确定";

        let childrenDom = this.props.children ? this.props.children : this.props.dialogContent;

        let isShowMaskClassName = classNames({
            'dialog-show': props.isDialogShow,
            'dialog-hide': !props.isDialogShow,
            'dialog-mask': true,
        });        
        let isShowDialogClassName = classNames({
            'dialog-show': props.isDialogShow,
            'dialog-hide': !props.isDialogShow,
            'dialog-dialog': true
        });
        return(
            <div>
                <div 
                    className="dialog-mask" 
                    // onClick={ function(){ this.props.dialogHide() }.bind(this) } 
                    className={isShowMaskClassName}
                >
                </div>
                <div className="" className={isShowDialogClassName}>
                    <div className="dialog-title">
                        { childrenDom }
                    </div>
                    <div className="dialog-content">
                    </div>
                    <div className="dialog-btn">
                        <button 
                            className="dialog-item dialog-cancel only-one-cancel" 
                            onClick={ function(){ this.props.dialogHide() }.bind(this) }
                        >
                            { btnCencle }
                        </button>
                    </div>
                </div>
            </div>
        );
    };
};

export default Dialog;