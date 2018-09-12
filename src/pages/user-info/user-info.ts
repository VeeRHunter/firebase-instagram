import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { FirebaseProvider } from '../../providers/firebase';
import { MessagePage } from '../message/message';
import { CommentsPage } from '../comments/comments';
import { ImageModalPage } from '../image-modal/image-modal';
import * as firebase from 'firebase';
import _ from 'lodash';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { ViewPostPage } from '../view-post/view-post';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {
  private user: any;
  private userId: any;
  private friendRequests: any;
  private requestsSent: any;
  public currentUser: any;
  private friends: any;
  private alert: any;
  public timelineData: any;
  following: any;
  icons = 'grid';
  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider,
    private nativeGeocoder: NativeGeocoder) { }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    this.loadingProvider.show();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      console.log('user', user);
      this.currentUser = user;

      if (user.following) {
        this.following = user.following;
      } else {
        this.following = [];
      }
    });

    // Get user info.
    this.dataProvider.getUser(this.userId).subscribe((user) => {
      this.user = user;
      console.log("this.user");
      console.log(this.user);
      this.loadingProvider.hide();
    });
    // Get friends of current logged in user.
    this.dataProvider.getUser(firebase.auth().currentUser.uid).subscribe((user) => {
      this.friends = user.friends;
    });
    // Get requests of current logged in user.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests) => {
      this.friendRequests = requests.friendRequests;
      this.requestsSent = requests.requestsSent;
    });

    //Getting  User Timeline     
    if (this.user.$key) {
      this.timelineData = [];
      this.loadingProvider.show();
      this.dataProvider.getInterests(this.user.$key).subscribe((data) => {
        console.log('POSTLIST', data);
        var timelineList = data;

        if (timelineList) {
          timelineList.forEach(postId => {
            this.dataProvider.getTimeline(postId.$value).subscribe((post) => {



              this.loadingProvider.hide();
              console.log('POST', post);


              let timeline = post;
              let tempData = <any>{};
              tempData = timeline;


              this.dataProvider.getUser(this.user.$key).subscribe((user) => {
                tempData.avatar = user.img;
                tempData.name = user.name
              });

              //Check Location
              if (timeline.location && timeline.location !== "Mohali") {
                let tempLocaion = JSON.parse(timeline.location);
                tempData.lat = tempLocaion.lat;
                tempData.long = tempLocaion.long;
                this.locationAddress(tempLocaion, (address: any) => {
                  tempData.locationAddress = address.locality + ", " + address.countryCode;
                  console.log(tempData.locationAddress);
                });
              }

              //  ===== check like
              this.dataProvider.getLike(tempData.$key).subscribe((likes) => {
                tempData.likes = likes.length;
                // Check post like or not

                let isLike = _.findKey(likes, (like) => {
                  let _tempLike = <any>like;
                  return _tempLike.$value == firebase.auth().currentUser.uid;
                })

                if (isLike) {
                  tempData.isLike = true;
                } else {
                  tempData.isLike = false;
                }
              });

              //  ===== check commnets
              this.dataProvider.getComments(tempData.$key).subscribe((comments) => {
                // console.log("====comm",comments)
                tempData.comments = comments.length;
                // Check post like or not

                let isComments = _.findKey(comments, (comment) => {
                  let _tempComment = <any>comment;
                  return _tempComment.commentBy == firebase.auth().currentUser.uid;
                })

                if (isComments) {
                  tempData.isComment = true;
                } else {
                  tempData.isComment = false;
                }

              });
              console.log(tempData);
              // this.addOrUpdateTimeline(tempData)
              this.timelineData.unshift(tempData);
            });
          });
        }

      });
      if (this.timelineData) {
        this.timelineData.sort(function (a, b) {
          var d1 = new Date(a.dateCreated);
          var d2 = new Date(b.dateCreated);
          return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
        });
      }
    } else { this.loadingProvider.hide(); }
    this.loadingProvider.hide();
  }

  //get Location
  locationAddress(location, success) {

    this.nativeGeocoder.reverseGeocode(location.lat, location.long)
      .then((result) => {
        console.log(JSON.stringify(result));
        success(result);
      }).catch((error: any) => console.log(error));
  }

  // Back
  back() {
    this.navCtrl.pop();
  }
  //bookmark clicked

  //edit clicked
  onEdit() {
    this.navCtrl.push(SettingsPage);
  }
  //edit notification
  onNotification(post) {
    this.firebaseProvider.alertPost(post.$key);
  }


  // Accept friend request.
  acceptFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Accept',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Deny friend request.
  rejectFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Reject Friend Request',
      message: 'Do you want to reject <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Send friend request.
  sendFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Open chat with this user.
  sendMessage() {
    this.navCtrl.push(MessagePage, { userId: this.userId });
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.friendRequests) {
      if (this.friendRequests.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.requestsSent) {
      if (this.requestsSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.friends) {
      if (this.friends.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }

  likePost(post) {
    this.firebaseProvider.likePost(post.$key)
  }

  bookmarkPost(post) {
    this.firebaseProvider.bookmarkPost(post.$key);
  }

  alertPost(post) {
    this.firebaseProvider.alertPost(post.$key);
  }

  isFavorite(post) {
    const { bookmark } = this.currentUser;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.$key) !== -1)
      return true;

    return false;
  }

  isAlert(post) {
    const { alerts } = this.currentUser;

    if (!alerts)
      return false;

    if (alerts.indexOf(post.$key) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    this.firebaseProvider.delikePost(post.$key)
  }

  commentPost(post) {
    console.log(post)
    let modal = this.modalCtrl.create(CommentsPage, { postKey: post.$key });
    modal.present();
  }

  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  //Follow User
  follow(user) {
    this.firebaseProvider.followUser(user.$key);
  }

  //unfollow User
  unfollow(user) {
    this.firebaseProvider.unfollowUser(user.$key);

  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {

    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    // 3 when this user are being followed yet;
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }

    console.log('USER', user);
    console.log('followers', this.following);


    if (this.friendRequests) {
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i] == user.$key) {
          return 2;
        }
      }
    }
    if (this.following) {
      for (var i = 0; i < this.following.length; i++) {
        if (this.following[i] == user.$key) {
          return 3;
        }
      }
    }
    return 0;
  }

  //view post when square img
  viewPost(post) {
    this.navCtrl.push(ViewPostPage, { post: post });
  }


}
