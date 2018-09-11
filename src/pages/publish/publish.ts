import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";
import { Geolocation } from '@ionic-native/geolocation';
import { FirebaseProvider } from '../../providers/firebase';
import { LoadingProvider } from '../../providers/loading';
import { ImageProvider } from '../../providers/image';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertProvider } from '../../providers/alert';
import { TabsPage } from '../../pages/tabs/tabs';
import { TabsService } from '../../util/tabservice';
import * as firebase from 'firebase';

/**
 * Generated class for the PushblishPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-publish',
  templateUrl: 'publish.html',
})
export class PublishPage {

  location: any;
  postText: any;
  image;
  caption;
  segment = "followers";
  tabBarElement: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    private app: App,
    private viewController: ViewController,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public angularDb: AngularFireDatabase,
    private alertProvider: AlertProvider,
    private firebaseProvider: FirebaseProvider,
    private geolocation: Geolocation,
    private tabService : TabsService
  ) {

    this.image = this.navParams.get('image');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PushblishPage');
  }

  share() {
    this.loadingProvider.show();
    this.locationShare(() => {
      this.imageProvider.uploadPostImage(this.image.replace('octet-stream', 'jpeg'), ).then((url) => {
        this.angularDb.list('timeline').push({
          dateCreated: new Date().toString(),
          postBy: firebase.auth().currentUser.uid,
          postText: this.postText ? this.postText : null,
          image: url,
          location: this.location ? this.location : null
        }).then((success) => {
          this.postText = '';
          let timelineId = success.key;
          this.firebaseProvider.timeline(timelineId);        


          this.navCtrl.popAll();
          this.alertProvider.showToast('Add post successfully ..');
          // this.navCtrl.push(TabsPage);
          this.navCtrl.pop();
          this.app.getRootNav().getActiveChildNav().select(0);

          this.loadingProvider.hide();
          this.tabService.show();
        }).catch((error) => {
          console.log('Error', error);
        });
      });
    });
    this.tabService.show();

    //this.navCtrl.parent.select(0);
  }


  locationShare(success) {
    this.loadingProvider.show();
    var options = { timeout: 10000, enableHighAccuracy: true };
    this.loadingProvider.hide();
    this.location = JSON.stringify({lat:55.755825,long : 37.617298})
    success();
    // this.geolocation.getCurrentPosition(options).then((position) => {
    //   this.location = JSON.stringify({ lat: position.coords.latitude, long: position.coords.longitude })
    //   //  this.loadingProvider.hide();
    //   success();
    // }, (err) => {
    //   this.loadingProvider.hide();
    //   console.log(err);
    // });
  }

}
