import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';

/**
 * Generated class for the TagsPartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tags-part',
  templateUrl: 'tags-part.html',
})
export class TagsPartPage {
  items = ['TypeScript', 'Angular', 'Ionic'];
  items2 = ['TypeScript', 'Angular', 'Ionic'];
  items3 = ['TypeScript', 'Angular', 'Ionic'];
  items4 = ['TypeScript', 'Angular', 'Ionic'];
  items5 = ['TypeScript', 'Angular', 'Ionic'];
  items6 = ['TypeScript', 'Angular', 'Ionic'];
  items7: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseProvider: FirebaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPartPage');
  }

  tagStrVerify(str: string): boolean {
    return str !== 'ABC' && str.trim() !== '';
  }

  onChange(val: string) {
    console.log(val)
  }

  onFocus() {
    console.log('Focus')
  }

  onBlur() {
    console.log('Blur')
  }

  backTags() {
    this.navCtrl.pop();
  }

  postTags() {
    console.log(this.items);
    // this.firebaseProvider.tagsPost(this.items);
  }

}
