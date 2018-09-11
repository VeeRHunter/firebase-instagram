import { Component } from '@angular/core';
import { LogoutProvider } from '../../providers/logout';
import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { ImageProvider } from '../../providers/image';
import { DataProvider } from '../../providers/data';
import {AngularFireDatabase} from 'angularfire2/database';
import { Validator } from '../../validator';
import { LoginPage } from '../login/login';

// import { Login } from '../../login';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { ColorPickerPage } from '../color-picker/color-picker';

import {  NavParams, App } from 'ionic-angular';
import { NavController, AlertController } from 'ionic-angular';
import { CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup } from '@angular/forms';
import countries from '../../util/countries';

/**
 * Generated class for the AddUserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {

  private user: any;
  private alert;
  private type : number = 0;
  private status : number = 0;
  private color : string = '#ff0000';
  image = 'assets/images/socodeapp-icon.png';
  
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public navParams: NavParams, public app: App,
    public logoutProvider: LogoutProvider, public loadingProvider: LoadingProvider, public imageProvider: ImageProvider,public angularDb:AngularFireDatabase, public alertProvider: AlertProvider, public dataProvider: DataProvider, public camera: Camera
    
    ) {
    this.logoutProvider.setApp(this.app);
    this.user = {
      phone: '',
      username: '',
      name: '',
      image: '',
      type : 0,
      status : 0,
      color : '#ff0000',
      email : '',
      password : ''
    }

    // this.loginProvider.register(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"], user);
  }

  ionViewDidLoad() {
    
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
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }).then((imageData) => {
              console.log(imageData);
              
              this.image = 'data:image/jpeg;base64,' +imageData;
              this.user.image = this.image;
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.CAMERA
            }).then((imageData) => {
              console.log(imageData);
              
              this.image = 'data:image/jpeg;base64,' +imageData;
              this.user.image = this.image;
            });         
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
                  //this.loadingProvider.show();
                  let profile = {
                    displayName: name,
                    photoURL: this.user.photoURL
                  };
                  
                  this.user.name = name;
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
               this.user.username = username;
            }
          }
        }
      ]
    }).present();
  }
  //onTypeChanged is called.
  onTypeChanged(){
     console.log('onTypeChanged() :' + this.type) ;
     this.user.type = this.type;
     //this.setType();
  }
  //onStatusChanged is called
  onStatusChanged(){
    console.log('onStatusChanged() :' + this.status);
    this.user.status = this.status;
    // this.setStatus();
  }
  //chooseColor is called
  chooseColor(){
    console.log('chooseColor() is selected');
    this.navCtrl.push(ColorPickerPage,{
      callback : this.colorSelectedCallback,
      color : this.color
    });
  }
  //called returned from color picker screen
  colorSelectedCallback = (_params) => {
    return new Promise((resolve,reject) => {
        this.changeColor(_params);
        resolve();
    });
  }
  //change color function
  changeColor(color){
    console.log('change color is called');
    if(this.color != color){
       this.color = color;
       this.user.color = this.color;
    }

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
              this.user.description = description;
            }
          }
        }
      ]
    }).present();
  }

  // Change user's email. Uses Validator.ts to validate the entered email. After, update the userData on database.
  // When the user changed their email, they have to confirm the new email address.
  setEmail() {
    this.alert = this.alertCtrl.create({
      title: 'Change Email Address',
      message: "Please enter a new email address.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your Email Address',
          value: this.user.email
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
            let email = data["email"];
            //Check if entered email is different from the current email
            if (this.user.email != email) {
              //Check if email is valid.
              if (Validator.profileEmailValidator.pattern.test(email)) {
                //this.loadingProvider.show();
                // Update email on Firebase.
                this.user.email = email;
              } else {
                this.alertProvider.showErrorMessage('profile/invalid-email');
              }
            }
          }
        }
      ]
    }).present();
  }

  // Change user's password, this option only shows up for users registered via Firebase.
  // The currentPassword is first checked, after which the new password should be entered twice.
  // Uses password validator from Validator.ts.
  setPassword() {
    this.alert = this.alertCtrl.create({
      title: 'Create Password',
      message: "Please enter a new password.",
      inputs: [
        {
          name: 'password',
          placeholder: 'New Password',
          type: 'password'
        },
        {
          name: 'confirmPassword',
          placeholder: 'Confirm Password',
          type: 'password'
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
            let currentPassword = data["currentPassword"];
            
          //  this.loadingProvider.show();
            
                let password = data["password"];    
                  if (password.length >= Validator.profilePasswordValidator.minLength) {
                    if (Validator.profilePasswordValidator.pattern.test(password)) {
                      if (password == data["confirmPassword"]) {
                        // Update password on Firebase.
                          this.user.password = password; 
                      } else {
                        this.alertProvider.showErrorMessage('profile/passwords-do-not-match');
                      }
                    } else {
                      this.alertProvider.showErrorMessage('profile/invalid-chars-password');
                    }
                  } else {
                    this.alertProvider.showErrorMessage('profile/password-too-short');
                  }
                }
          
        }
      ]
    }).present();
  }

  // Delete the user account. After deleting the Firebase user, the userData along with their profile pic uploaded on the storage will be deleted as well.
  // If you added some other info or traces for the account, make sure to account for them when deleting the account.
  deleteAccount() {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete your account? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
         //   this.loadingProvider.show();
            // Delete Firebase user
            firebase.auth().currentUser.delete()
              .then((success) => {
                // Delete profilePic of user on Firebase storage
                this.imageProvider.deleteUserImageFile(this.user);
                // Delete user data on Database
                this.angularDb.object('/accounts/' + this.user.userId).remove().then(() => {
                  this.loadingProvider.hide();
                  this.alertProvider.showAccountDeletedMessage();
                  this.logoutProvider.logout().then(res=>{
                      this.navCtrl.parent.parent.setRoot(LoginPage)
                  });
                });
              })
              .catch((error) => {
                this.loadingProvider.hide();
                let code = error["code"];
                this.alertProvider.showErrorMessage(code);
                if (code == 'auth/requires-recent-login') {
                  this.logoutProvider.logout().then(res=>{
                      this.navCtrl.parent.parent.setRoot(LoginPage)
                  });
                }
              });
          }
        }
      ]
    }).present();
  }

  // Log the user out.
  logout() {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: data => {
            this.logoutProvider.logout().then(res=>{
                this.navCtrl.parent.parent.setRoot(LoginPage)
            });

           }
        }
      ]
    }).present();
  }
  //create New User
  createUser(){
    console.log('createUser is clicked.');
    this.loadingProvider.show();
   // this.loginProvider.register(this.user.email, this.user.password, this.user);
    var email = this.user.email;
    var password = this.user.password;
    var obj = this.user;
    //this.loadingProvider.show();
    // console.log('email : ' + email + ' :password :' + password);
    if(this.user.username.length == 0 || obj.name.length == 0 || obj.description.length == 0){
        this.alertProvider.showErrorMessage('profile/create_empty_field');
        this.loadingProvider.hide();
        return;
    }

    //create the fake user
    var uid =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    obj.uid = uid;
    firebase.database().ref('accounts/' + uid).set({
      userId: uid,
      phone: obj.phone,
      name: obj.name,
      username: obj.username,
      description : obj.description,
      color : obj.color
     }).then((user) => {
      this.imageProvider.uploadProfilePhotoForFake(obj, obj.image);

    });
    this.alertProvider.showErrorMessage('profile/create_user_success');
    this.loadingProvider.hide();
  
  }
}
