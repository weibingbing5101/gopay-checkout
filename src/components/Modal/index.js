/**
 * Created by liubingli on 2017-1-19.
 */
import React from 'react';
import classNames from 'classnames';

require('./index.less');

class Modal extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        visible: false
      }
    }; 

    _hide=()=>{
      this.setState({
        visible: false
      })
    }

    _show=()=>{
      this.setState({
        visible: true
      })
    }

    componentWillReceiveProps(nextProps) {
      let visible = this.state.visible;
      if(nextProps.visible!==visible){
        this.setState({
          visible: nextProps.visible
        })
      }
    }

    render(){
      let {children} = this.props;
      let visible = this.state.visible;
      let panelClass = classNames({
        "modal": true,
        "modal-show": visible
      })
      return(
        <div className={panelClass}>
          <div className="modal-mask" onTouchEnd={this._hide}></div>
          <div className="modal-content">
            {children}
          </div>
        </div>
      );
    };
};

export default Modal;