import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Helps } from '../api/helps.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Profile from './Profile.js';
 
import Help from './Helps.js';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      hideCompleted: false,
      dataUser:  this.props.data.filter(owner => owner.owner ==this.props.currentUser._id)[0],
    };
  }

//Enviar a BD cuando hago intro en el form
   handleSubmit(event) {
      event.preventDefault();
   
      // Find the text field via the React ref
      const tittle = ReactDOM.findDOMNode(this.refs.tittleInput).value.trim();
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      const points = ReactDOM.findDOMNode(this.refs.pointsInput).value.trim();

      if(tittle ==="" ||text ==="" ||points ==="" ){
        alert("Por favor inserta la información completa");
      }else{
         let data = this.props.data;
         data = data.filter(owner => owner.owner ==this.props.currentUser._id);
         console.log(data);
         if(data[0]===undefined || data[0] === null){
          if(points<=30){
               Meteor.call('helps.insertPoints',30);
              Meteor.call('helps.setPoints', 30-points);
              Meteor.call('helps.insert',tittle, text, points);
          }else{
             alert("Los puntos que tienes no son suficientes :(");
          }
           
         }else{            
            if(data[0].points< points){                   
            alert("Los puntos que tienes no son suficientes :(");
           }
            else{
               Meteor.call('helps.insert',tittle, text, points);
               Meteor.call('helps.setPoints', data[0].points-points);
            }
         }
        
              
        // Clear form
        ReactDOM.findDOMNode(this.refs.tittleInput).value = '';
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        ReactDOM.findDOMNode(this.refs.pointsInput).value = '';
      }
      
     
  }
 handleSubmitHelper(event) {
     event.preventDefault();
   
      // Find the text field via the React ref
      const helper = ReactDOM.findDOMNode(this.refs.username).value.trim();
      const rate = ReactDOM.findDOMNode(this.refs.textRate).value.trim();
      const points = ReactDOM.findDOMNode(this.refs.pointsGive).value.trim();

      Meteor.call('helps.setPointsRate',helper, rate, points);
      alert("Ya pagaste tu salvada  ");
      ReactDOM.findDOMNode(this.refs.username).value = '';
      ReactDOM.findDOMNode(this.refs.textRate).value = '';
      ReactDOM.findDOMNode(this.refs.pointsGive).value = '';
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

  renderRegistrarAyuda(){
     return(<form className="new-help-calification">
              <input
                type="text"
                ref="username"
                placeholder="Escribe el username del usuario que te ayudo"
              />
              <input
                type="textArea"
                ref="textRate"
                placeholder="Escribe una calificación para el usuario"
              />
              <input
                type="text"
                ref="pointsGive"
                placeholder="Cuanto puntos le das?"
              />
              <button onClick= {this.handleSubmitHelper.bind(this)}>
                Enviar
              </button>

            </form> );
  }
  renderProfile(){
    let pointsSt = 0;
    let rate =5;
    let data = this.props.data;    
    if(this.props.currentUser === null || this.props.currentUser === undefined){
      return (' ');
    }else{
      data = data.filter(owner => owner.owner ==this.props.currentUser._id);
      if(data[0] === undefined || data[0] === null){
         pointsSt = 30;
      }else{
        pointsSt = data[0].points;
        rate = data[0].rate;
      }
     
      return(<Profile 
          username = {this.props.currentUser.username}
          rate = {rate}
          points= {pointsSt}

            />);
      }
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
      const showHelpButton = !(helps.owner === currentUserId); 

      return (
        <Help
          key={helps._id}
          help={helps}
          showDeleteButton={showDeleteButton}
          showCompleteButton={showCompleteButton}
          showHelpButton = {showHelpButton}
        />
      );
    });
  }
 

  render() {
    if(this.props.currentUser){
      return( <div className="container">
        <header>
        {this.renderProfile()}
        {this.renderRegistrarAyuda()}
          <h1>Ayudas Pendientes({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Esconder ayudas completadas
          </label>
          <AccountsUIWrapper />
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
      </div>);
    }
    else{
      return(<div>
          <h1>Ayudaton</h1>
          <h3>Ayudaton es una comunidad en la que ayudas a los dem&aacute;s  y ser&aacute;s ayudado. Hoy por mi, ma&ntilde;ana por ti!</h3>     
          <img src="./perfil.PNG" alt="Imagen ayudaton"/>
          <AccountsUIWrapper />
      </div>);         
     }
  }
}

  export default withTracker(() => {

 Meteor.subscribe('helps');
 Meteor.subscribe('users');
 Meteor.subscribe('helpsUser');
    
  return {
    helps: Helps.find({type: {$ne: 'data'}}, { sort: { createdAt: -1 } }).fetch(),    
    incompleteCount: Helps.find({ checked: { $ne: true }, type: {$ne : 'data'}}).count(),
    currentUser: Meteor.user(),
    countHelps: Helps.find({ owner: Meteor.user() }).count(),
    data: Helps.find({type : 'data'}).fetch(),
  };
})(App);