/**
 * @file 不带label
 */

'use strict';

import React from 'react';

class SimulateInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			pointer: ''
		}

		this.pointerTimer = null;
		this.pointerShow = true;


		this.pointerTimer = setInterval(()=>{

			this.setState({
				pointer: this.pointerShow ? '|' : ''
			},  ()=>{
				this.pointerShow = !this.pointerShow;
			} )



		}, 500)

	}

	componentDidMount() {


		
	}

	componentWillReceiveProps(nextProps) {
		let value = nextProps;
	}

	render(){
		let props = this.props;
		return (
				<div>
					<div 
						readOnly="true" 
						className="simulate-input" 
						placeholder={props.placeholder} 
						onClick={ props.onClick }>
						{props.value}
						<span>{this.state.pointer}</span>
					</div>

				</div>
		);
	}

	
};

SimulateInput.defaultProps = {
	
};

export default SimulateInput;