import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginProvider } from '../../providers/login';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../validator';
import countries from '../../util/countries';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  private mode: string;
  private step = 1;
  private emailPasswordForm: FormGroup;
  private emailForm: FormGroup;
  countryCode: any = "+55";
  countries: any = countries;
  name: string = '';
  username: string = '';
  image = 'assets/images/socodeapp-icon.png';
  defaultImg = 'assets/images/socodeapp-icon.png';
  phone: any = '';
  // LoginPage
  // This is the page where the user can register and login to our app.
  // It's important to initialize the loginProvider here and setNavController as it will direct the routes of our app.
  constructor(public navCtrl: NavController, public loginProvider: LoginProvider, public formBuilder: FormBuilder, private alertCtrl: AlertController, public camera: Camera) {
    // It's important to hook the navController to our loginProvider.
    this.loginProvider.setNavController(this.navCtrl);
    // Create our forms and their validators based on validators set on validator.ts.
    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      phone: Validator.phoneValidator,
      countryCode: Validator.countryValidator
    });
    this.emailForm = formBuilder.group({
      email: Validator.emailValidator
    });
  }

  ionViewDidLoad() {
    // Set view mode to main.
    this.mode = 'login';
  }

  // Call loginProvider and login the user with email and password.
  // You may be wondering where the login function for Facebook and Google are.
  // They are called directly from the html markup via loginProvider.facebookLogin() and loginProvider.googleLogin().
  login() {

    this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);

  }

  //select a photo
  setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let alert = this.alertCtrl.create({
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
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
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
            });            
          }
        }
      ]
    }).present();
  }

  // Call loginProvider and register the user with email and password.
  register() {
    const phone: string = this.countryCode + this.phone;
    const user = {
      phone: phone,
      username: this.username,
      name: this.name,
      image: this.image,
      type : 0,
      status : 0
    }

    let self = this;
    if (this.emailPasswordForm.value["phone"]) {
      (<any>window).FirebasePlugin.verifyPhoneNumber(phone, 60, (credential) => {
        console.log(credential);
        // ask user to input verificationCode:
        const { verificationId } = credential;
        let prompt = self.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Send',
              handler: data => {
                this.loginProvider.registerByPhone(user, verificationId, data.confirmationCode);
              }
            }
          ]
        });
        prompt.present();
      }, function (error) {
        console.error(error);
      });

    } else {
      this.loginProvider.register(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"], user);
    }
  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
    this.countryCode = "+55";
  }

}
