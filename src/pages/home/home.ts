import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, App, PopoverController, ModalController } from 'ionic-angular';
import { LogoutProvider } from '../../providers/logout';
import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { ImageProvider } from '../../providers/image';
import { DataProvider } from '../../providers/data';
import { AngularFireDatabase } from 'angularfire2/database';
import { Validator } from '../../validator';
import { LoginPage } from '../login/login';
import { SettingsPage } from '../settings/settings';
import { FavoritesPage } from '../favorites/favorites';
import { PostOptionsComponent } from '../../components/post-options/post-options';

import { Login } from '../../login';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera';

import _ from 'lodash';
import { CommentsPage } from '../comments/comments';
import { ImageModalPage } from '../image-modal/image-modal';
import { UserInfoPage } from '../user-info/user-info';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { FirebaseProvider } from '../../providers/firebase';
import { ViewPostPage } from '../../pages/view-post/view-post';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private user: any;
  private alert;
  public timelineData: any;
  public favoriteTimeline: any;
  icons = 'grid';
  // HomePage
  // This is the page where the user is directed after successful login and email is confirmed.
  // A couple of profile management function is available for the user in this page such as:
  // Change name, profile pic, email, and password
  // The user can also opt for the deletion of their account, and finally logout.
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public app: App,
    public logoutProvider: LogoutProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,
    public camera: Camera,
    private nativeGeocoder: NativeGeocoder,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public firebaseProvider: FirebaseProvider) {
    this.logoutProvider.setApp(this.app);
  }

  ionViewDidLoad() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.loadingProvider.show();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.loadingProvider.hide();
      this.user = <any>user;
      console.log('User data', user);

    });

    //Getting Current User
    this.dataProvider.getTimelines().subscribe((timeline) => {
      this.timelineData = [];
      console.log('personal', timeline);

      if (timeline) {
        timeline.forEach(data => {
          this.dataProvider.getTimeline(data.$value).subscribe((post) => {

            console.log(data);


            let timeline = post;
            let tempData = <any>{};
            tempData = timeline;

            tempData.$value = data.$key;

            this.dataProvider.getUser(timeline.postBy).subscribe((user) => {
              tempData.avatar = user.img;
              tempData.name = user.name
            });

            // Check Location
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
          this.loadingProvider.hide();
        });
      } else { this.loadingProvider.hide(); }
      this.loadingProvider.hide();
    });
    this.loadingProvider.hide();

    //favorite
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.favoriteTimeline = [];
      const { bookmark } = user;
      let tempData;
      console.log(bookmark);
      if (bookmark) {
        bookmark.forEach(postId => {
          this.dataProvider.getTimeline(postId).subscribe((post) => {
            this.loadingProvider.hide();

            let timeline = post;
            let tempData = <any>{};
            tempData = timeline;


            this.dataProvider.getUser(timeline.postBy).subscribe((user) => {
              tempData.avatar = user.img;
              tempData.name = user.name
            });

            // Check Location
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
            // this.addOrUpdateTimeline(tempData);
            this.favoriteTimeline.unshift(tempData);
          });

        });
      } else { this.loadingProvider.hide(); }
    });
  }

  goSettings() {
    this.navCtrl.push(SettingsPage);
  }

  goFavorites() {
    this.navCtrl.push(FavoritesPage);
  }


  presentOptions(event, post) {
    let popover = this.popoverCtrl.create(PostOptionsComponent, { key: post.$key, value: post.$value });
    popover.present({
      ev: event
    });
  }

  // Change user's profile photo. Uses imageProvider to process image and upload on Firebase and update userData.
  setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alert = this.alertCtrl.create({
      title: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            console.log('Gallery');
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).present();
  }

  // Change user's profile name, username, and description.
  setName() {
    this.alert = this.alertCtrl.create({
      title: 'Change Profile Name',
      message: "Please enter a new profile name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Your Name',
          value: this.user.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            // Check if entered name is different from the current name
            if (this.user.name != name) {
              // Check if name's length is more than five characters
              if (name.length >= Validator.profileNameValidator.minLength) {
                // Check if name contains characters and numbers only.
                if (Validator.profileNameValidator.pattern.test(name)) {
                  this.loadingProvider.show();
                  let profile = {
                    displayName: name,
                    photoURL: this.user.photoURL
                  };
                  // Update profile on Firebase
                  firebase.auth().currentUser.updateProfile(profile)
                    .then((success) => {
                      // Update userData on Database.
                      this.angularDb.object('/accounts/' + this.user.userId).update({
                        name: name
                      }).then((success) => {
                        Validator.profileNameValidator.pattern.test(name); //Refresh validator
                        this.alertProvider.showProfileUpdatedMessage();
                      }).catch((error) => {
                        this.alertProvider.showErrorMessage('profile/error-update-profile');
                      });
                    })
                    .catch((error) => {
                      // Show error
                      this.loadingProvider.hide();
                      let code = error["code"];
                      this.alertProvider.showErrorMessage(code);
                      if (code == 'auth/requires-recent-login') {
                        this.logoutProvider.logout().then(res => {
                          this.navCtrl.parent.parent.setRoot(LoginPage)
                        });
                      }
                    });
                } else {
                  this.alertProvider.showErrorMessage('profile/invalid-chars-name');
                }
              } else {
                this.alertProvider.showErrorMessage('profile/name-too-short');
              }
            }
          }
        }
      ]
    }).present();
  }

  //Set username
  setUsername() {
    this.alert = this.alertCtrl.create({
      title: 'Change Username',
      message: "Please enter a new username.",
      inputs: [
        {
          name: 'username',
          placeholder: 'Your Username',
          value: this.user.username
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let username = data["username"];
            // Check if entered username is different from the current username
            if (this.user.username != username) {
              this.dataProvider.getUserWithUsername(username).take(1).subscribe((userList) => {
                if (userList.length > 0) {
                  this.alertProvider.showErrorMessage('profile/error-same-username');
                } else {
                  this.angularDb.object('/accounts/' + this.user.userId).update({
                    username: username
                  }).then((success) => {
                    this.alertProvider.showProfileUpdatedMessage();
                  }).catch((error) => {
                    this.alertProvider.showErrorMessage('profile/error-update-profile');
                  });
                }
              });
            }
          }
        }
      ]
    }).present();
  }

  //Set description
  setDescription() {
    this.alert = this.alertCtrl.create({
      title: 'Change Description',
      message: "Please enter a new description.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Your Description',
          value: this.user.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let description = data["description"];
            // Check if entered description is different from the current description
            if (this.user.description != description) {
              this.angularDb.object('/accounts/' + this.user.userId).update({
                description: description
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    }).present();
  }

  locationAddress(location, success) {

    this.nativeGeocoder.reverseGeocode(location.lat, location.long)
      .then((result) => {
        console.log(JSON.stringify(result));
        success(result);
      }).catch((error: any) => console.log(error));
  }

  likePost(post) {
    this.firebaseProvider.likePost(post.$key);
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

  //view post when square img
  viewPost(post) {
    this.navCtrl.push(ViewPostPage, { post: post });
  }


}
