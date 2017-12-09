import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Helps } from '../api/helps.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
 
import Help from './Helps.js';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

//Enviar a BD cuando hago intro en el form
   handleSubmit(event) {
      event.preventDefault();
   
      // Find the text field via the React ref
      const tittle = ReactDOM.findDOMNode(this.refs.tittleInput).value.trim();
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      const points = ReactDOM.findDOMNode(this.refs.pointsInput).value.trim();
   
      Meteor.call('helps.insert',tittle, text, points);
        
      // Clear form
      ReactDOM.findDOMNode(this.refs.tittleInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.pointsInput).value = '';
  }
 
  getHelpsTest() {
    return [
      { _id: 1, tittle: 'Help1' ,text: 'This is the help 1' , puntos: 10},
      { _id: 2, tittle: 'Help2' ,text: 'This is the help 2' , puntos: 15},
      { _id: 3, tittle: 'Help3' ,text: 'This is the help 3' , puntos: 20},
    ];
  }
 //Actividad hecha
 toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderHelps() {

    let filteredHelps = this.props.helps; //Obtener de los props
    if (this.state.hideCompleted) {
     filteredHelps = filteredHelps.filter(help => !help.checked);
    }
    return filteredHelps.map((helps) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showCompleteButton = helps.owner === currentUserId; 
      const showDeleteButton = helps.owner === currentUserId; 

      return (
        <Help
          key={helps._id}
          help={helps}
          showDeleteButton={showDeleteButton}
        />
      );
    });
  }
 

  render() {
    return (
        <div className="container">
        <header>
          <h1>Ayudas Pendientes({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />

           { this.props.currentUser ?
            <form className="new-task">
              <input
                type="text"
                ref="tittleInput"
                placeholder="Escribe el titulo de una nueva ayuda"
              />
              <input
                type="textArea"
                ref="textInput"
                placeholder="Escribe en que consiste"
              />
              <input
                type="text"
                ref="pointsInput"
                placeholder="Cuanto puntos das?"
              />
              <button onClick= {this.handleSubmit.bind(this)}>
                Enviar
              </button>

            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderHelps()}
        </ul>
      </div>
    );
    }
  }

  export default withTracker(() => {

 Meteor.subscribe('helps');
    
  return {
    helps: Helps.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Helps.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);