import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const Helps = new Mongo.Collection('helps');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('helpsUser', function tasksPublication() {
    return Helps.find({});
  });
Meteor.publish('helps', function helpsPublication() {
    return Helps.find({});
  });
Meteor.publish('usersData', function usersPublication() {
   return Users.find({
      $or: [
        { owner: this.userId },
     ],
    });
  });

}

Meteor.methods({
	'helps.insert'(tittle, text , points) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let user ="user";
    Helps.insert({
      type: user,
      tittle,
      text,
      points,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'helps.remove'(id) {
    check(id, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    } 
    Helps.remove(id);
  },
  'helps.setChecked'(helpId, setChecked) {
    check(helpId, String);
    check(setChecked, Boolean);
 
    Helps.update(helpId, { $set: { checked: setChecked } });
  },
  'helps.insertPoints'(points) {
     if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let user ="data";
    Helps.insert({
      type: user,
      points,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      rate: 5,
    });
  },
   'helps.setPoints'(setPoints) {
  
    console.log(setPoints);
    console.log(this.userId);
    Helps.update({owner : this.userId, type: 'data'}, { $set: { points: setPoints } });
  },
  'helps.setPointsRate'(helper, rate, setPoints){
      let p = parseInt(Helps.findOne({username: helper , type: 'data'}).points);
      let r =  parseInt(Helps.findOne({username: helper , type: 'data'}).rate);
      console.log(helper);
      console.log(p);
      console.log(r);
      Helps.update({username: helper},{$set:{points:(parseInt(setPoints)+p), rate: (r+parseInt(rate))/2}});
  },
  'tasks.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});