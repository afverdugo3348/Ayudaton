import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
 import classnames from 'classnames';
import { Helps } from '../api/helps.js';
// Task component - represents a single todo item
export default class Help extends Component {

 toggleChecked() {
    // Set the checked property to the opposite of its current value
   Meteor.call('helps.setChecked', this.props.help._id, !this.props.help.checked);
  }
 
  deleteThisHelp() {
   	Meteor.call('helps.remove', this.props.help._id);
  }
  doThisHelp() {
    ReactDOM.findDOMNode(this.refs.contactHelp).style = 'visibility : "visible"';
  }
  hiddenHelp() {
    ReactDOM.findDOMNode(this.refs.contactHelp).style = 'visibility: hidden';
  }
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render1() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });


    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
 	
 	{ this.props.showCompleteButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
         <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }


render(){
	return(
		<li>
		{this.props.showDeleteButton ? (
		<button className="delete" onClick={this.deleteThisHelp.bind(this)}>
        	&times;
        </button>
			): ''}
        { this.props.showCompleteButton ? (
          <input
          type="checkbox"
          readOnly
          checked={!!this.props.help.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        ) : ''}
        { this.props.showHelpButton ? (
         <button className="delete" onClick={this.doThisHelp.bind(this)}>
          Ayudar
        </button>
        ) : ''}
			<h1>Ayuda a : {this.props.help.username}</h1><br/>
			<span className="text">
           		<strong>{this.props.help.tittle} :</strong>
        	</span><br/>
        	<span className="text">
           		{this.props.help.text}
        	</span><br/>
        	<span className="text">
           		<strong>{this.props.help.points} puntos</strong>
        	</span>

          <div ref="contactHelp" className="contact-help" style={{visibility:"hidden"}}>
            <h3>Escrible un correo a {this.props.help.username} al siguiente correo: {this.props.help.username}@uniandes.edu.co</h3>
            <button onClick={this.hiddenHelp.bind(this)}>Anotado!</button>
          </div>
		</li>

		);
	}
}
