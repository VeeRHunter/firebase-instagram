import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserInfoPage } from '../../pages/user-info/user-info';
import { CommentsPage } from '../../pages/comments/comments';
import { FirebaseProvider } from '../../providers/firebase';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { ImageModalPage } from '../../pages/image-modal/image-modal';
import { TabsService } from '../../util/tabservice';

/**
 * Generated class for the ViewPostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {

  user: any;
  item: any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    private firebaseProvider : FirebaseProvider,
    private modalCtrl : ModalController,
    private dataProvider : DataProvider,
    private loadingProvider : LoadingProvider,
    private tabService : TabsService) {
      this.item = this.navParams.get('post');
      
  }

  ionViewWillEnter(){
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable. 
    this.loadingProvider.show();
    // this.createUserData();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      console.log(this.user);
      this.loadingProvider.hide();
    });
    this.tabService.hide();

  }

  ionViewDidLoad() {
    this.tabService.hide();
    
  }

  ionViewDidLeave(){
    this.tabService.show();
    
  }

  likePost(post) {
    this.firebaseProvider.likePost(post.$key);
    this.tabService.hide();
  }

  bookmarkPost(post) {
    this.firebaseProvider.bookmarkPost(post.$key);
    this.tabService.hide();
  }

  isFavorite(post) {
    if (!this.user) 
      return false;

    const { bookmark } = this.user;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.$key) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    this.firebaseProvider.delikePost(post.$key);
    this.tabService.hide();
  }

  commentPost(post) {
    console.log(post)
    let modal = this.modalCtrl.create(CommentsPage, { postKey: post.$key });
    modal.present().then(() => {
      this.tabService.hide();
    });
    
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  //View User  
  viewUser(userId) {
    this.navCtrl.push(UserInfoPage, { userId: userId });
  }

}
