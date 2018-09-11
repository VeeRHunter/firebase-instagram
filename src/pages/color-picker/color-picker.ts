import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { _ParseAST } from '@angular/compiler';

/**
 * Generated class for the ColorPickerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage {

  private color : string = '#ffffff';
  private callback : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

      this.color = this.navParams.get('color');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColorPickerPage');
  }
  ionViewWillEnter(){
    this.callback = this.navParams.get("callback");
  }
  ionViewWillLeave(){
    var _self = this;
    this.callback(this.color).then(() => {
            
    });
  }
  setColor(color){
    this.color = color;
    this.navCtrl.pop();
  }

}
