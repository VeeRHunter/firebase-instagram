import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';


@Component({
  selector: 'post-options',
  templateUrl: 'post-options.html'
})
export class PostOptionsComponent {
  public key: any;
  public value: any;
  
  constructor(public viewCtrl: ViewController, 
              private alertCtrl : AlertController,
              public firebaseProvider: FirebaseProvider,) {
    
    this.key = this.viewCtrl.data.key;
    this.value = this.viewCtrl.data.value;
    console.log(this.key);
    
    
  }

  deletePost() {
  
    let confirm = this.alertCtrl.create({
      title: 'Would you like delete this post?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            
            this.firebaseProvider.deletePost({key: this.key, value: this.value});
          }
        }
      ]
    });
    confirm.present().then(() => {
      this.viewCtrl.dismiss();
    });   
  
    
  }

}


