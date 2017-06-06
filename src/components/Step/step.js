/**
 * @file loading
 */

'use strict';

import React from 'react';
import './step.less';

class Step extends React.Component {

    constructor(props) {
        super(props);
    };

    getHtml(){
        let stepClass = '';
        if( this.props.step == 0){
            stepClass = 'step-box';
        }else if(this.props.step == 1){
            stepClass = 'step-box-one';
        }else if(this.props.step == 2){
            stepClass = 'step-box-two';
        }else if(this.props.step == 3){
            stepClass = 'step-box-three';
        }
        // console.log(stepClass);
        return <ul className={stepClass}>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    };

    render() {
        return (
            <div>
                { this.getHtml() }
            </div>
        );       
    }
}

Step.defaultProps = {
  text: '进度条'
};

export default Step;