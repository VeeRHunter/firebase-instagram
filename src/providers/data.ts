import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.

  constructor(public angularDb: AngularFireDatabase) {
    console.log("Initializing Data Provider");
  }

  // Get all users
  getUsers() {
    return this.angularDb.list('/accounts', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.angularDb.list('/accounts', {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    });
  }

  // Get logged in user data
  getCurrentUser() {
    return this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid);
  }

  // Get user by their userId
  getUser(userId) {
    return this.angularDb.object('/accounts/' + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.angularDb.object('/requests/' + userId);
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularDb.list('/requests', {
      query: {
        orderByChild: 'receiver',
        equalTo: userId
      }
    });
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularDb.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularDb.object('/conversations/' + conversationId + '/messages');
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularDb.object('/groups/' + groupId + '/messages');
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/groups');
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularDb.object('/groups/' + groupId);
  }

  // Get Timeline of user
  getTimelines() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/timeline');
  }

  // Get Timeline of user
  getTimelinesId(timelineId) {
    const res = this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/timeline/' + timelineId);
    console.log(res);

    return res;
  }

  // Get Timeline post
  getTimelinePost() {
    return this.angularDb.list('/timeline');
  }

  // Get time line by id
  getTimeline(timelineId) {
    return this.angularDb.object('/timeline/' + timelineId)
  }

  getInterests(timelineId) {
    return this.angularDb.list('/accounts/' + timelineId + '/timeline');
  }

  // Get Friend List
  getFriends() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/friends');
  }

  // Get comments list
  getComments(postId) {
    return this.angularDb.list('/comments/' + postId)
  }

  // Get likes
  getLike(postId) {
    return this.angularDb.list('/likes/' + postId)
  }

  postLike(postId) {
    return this.angularDb.object('/likes/' + postId)
  }

  // post Comments
  postComments(postId) {
    return this.angularDb.object('/comments/' + postId)
  }
}
