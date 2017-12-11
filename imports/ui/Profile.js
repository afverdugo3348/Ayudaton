import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
 import classnames from 'classnames';
import { Helps } from '../api/helps.js';
// Task component - represents a single todo item
export default class Profile extends Component {
   constructor(props) {
    super(props);
 }
 render(){
	return(

		<div style={{"border": "solid 1px", "margin": "10px", "position": "absolute", "width": "50%",  "height": "45%"}}>
      <h1 id="tittleUser">{this.props.username}</h1>
      <h3 id="rate">Tienes una calificación de {this.props.rate}</h3>
      <h3 id="points">Tienes {this.props.points} puntos</h3>
    </div>
		);
	}
}
