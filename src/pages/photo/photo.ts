import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { CameraPreview  } from '@ionic-native/camera-preview';
import {TabsService} from "../../util/tabservice";
import {CanvasDraw} from "./canvasdraw";
import {StoryService} from "../../providers/story.service";

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {

  srcPhoto = "";

  availableColours;

  mode = 'camera';

  @ViewChild('myCanvasDraw')
  canvas : CanvasDraw

  constructor(public navCtrl: NavController, public cameraPreview: CameraPreview, public platform : Platform, public tabsService : TabsService, public storyService : StoryService) {

    this.startCamera();

  }

  takePicture(){

    var self = this;

    const pictureOpts = {
      quality: 80
    }

    this.cameraPreview.takePicture(pictureOpts).then(base64PictureData =>{
    //   console.log("aqui takando foto", base64PictureData)

      self.srcPhoto = base64PictureData;

      this.mode = 'photo'

      self.cameraPreview.hide().then(() => {

      })

    });
  }

  done(){
    this.mode = 'photo';
  }

  save(){


    var image = this.canvas.canvasElement.toDataURL("image/png").replace("image/png", "image/octet-stream");

    console.log(image);


   var obj = {
      id: "pavei",
      photo: "assets/profile.jpg",
      name: "Roberval",
      lastUpdated: 1492665454,
      items: [
        StoryService.buildItem("ramon-1", "photo", 3, image, image, '', false, new Date().getTime()),
     ]
    }

    //this.storyService.addFeed(obj);

   this.back();

  }

  changeColour(colour){
  }

  ionViewWillEnter(){
   this.tabsService.hide();
  }

  ionViewWillLeave(){

    this.tabsService.show();
  }

  modeBrush(){
    this.mode = 'brush'
    this.availableColours = this.canvas.availableColours;

  }

  back(){
    try{
      // this.cameraPreview.hide().then(() =>{
      //  // this.navCtrl.setRoot(TabsPage);
      //
      //   this.cameraPreview.stopCamera().then(() =>{
      //     this.navCtrl.pop();
      //   }).catch(e =>{
      //
      //   });
      // })

      this.navCtrl.pop()
    }catch(e) {

    }

  }

  startCamera(){

    try{
      this.cameraPreview.stopCamera().then(() =>{

        console.log("camera started")

      }).catch(e =>{
        console.log("camera error")
      });
    }catch(e) {

    }
    // start camera
    this.cameraPreview.startCamera({x: 0, y: 0, width:this.platform.width(), height: this.platform.height(), toBack: true, previewDrag: false, tapPhoto: true});

  }

  refresh(){
    this.cameraPreview.switchCamera();
  }

  ngOnDestroy(){

  }

}
