import React from 'react';
import classNames from 'classnames';

export class CountDown extends React.Component{

  constructor(props) {
    super(props);
    this.inter = null;
    this.state = {
      seconds: this.props.seconds,
      old:this.props.seconds,
    };
  }

  componentDidMount(){
    this.inter = setInterval(()=>{
      let {seconds,onEnd} = this.props;
      if(seconds == this.state.old){
        seconds = this.state.seconds;
      }
      else{
        this.setState({old:seconds});
      }
      seconds--;
      if(seconds<0) seconds = 0;
      this.setState({seconds});
      //倒计时结束，这里在1秒时候就用回调，因为setInterval 不停止，所以一直是seconds0秒，防止每秒调用一次onEnd.
      if(seconds == 1){
        setTimeout(()=>{
          if(onEnd){
            onEnd();
          }
        },1000);
      
      }

    },1000);
  }



  componentWillUnmount(){
    if(this.inter){
      clearInterval(this.inter);
    }
  }

  render(){
    let {seconds} = this.state;
    let hour = Math.floor(seconds/3600);
    hour = hour<10?'0'+ hour:hour;
    let sec = seconds%3600;
    let min = Math.floor(sec/60);
    let m = min<10?'0'+min:min;
    let s = sec%60;
    s =s<10?'0'+s:s;
    return(
      <div style={{display:'inline-block'}}>
        <span className="cd_time_num">{hour}</span>
        <span className="cd_time_colon">:</span>
        <span className="cd_time_num">{m}</span>
        <span className="cd_time_colon">:</span>
        <span className="cd_time_num">{s}</span>
      </div>

      );
  }
}