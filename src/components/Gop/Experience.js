/**
 * Created by liubingli on 2017-1-19.
 */
import React from 'react';
import classNames from 'classnames';

import experienceImg from './img/experience.png';

class GopExperience extends React.Component {
    constructor(props) {
      super(props);

    }; 

    render(){

      return(
        <div className="gop-experience">
          <p>
            <img className="gop-experience-img" src={experienceImg} />
          </p>
          <p>
            送您的1000元体验果仁已到账
          </p>
        </div>
      );
    };
};

export default GopExperience;