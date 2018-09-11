import { Component, ViewChild } from "@angular/core";
import { NgClass } from '@angular/common';
import { App, Content, NavController, Platform, ViewController } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';
// import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { CameraPreview } from "@ionic-native/camera-preview";
import { ShowPhoto } from "../show-photo/show-photo";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { ImageService } from "../../util/imageservice";
import { ImageEntity } from "../../util/ImageEntity";
import { UnsplashItUtil } from "../../util/unsplashItutil";
import { LoadingProvider } from "../../providers/loading";
import { DataProvider } from '../../providers/data';
import { StoryService } from '../../providers/story.service';
import { ImageProvider } from '../../providers/image';
import { DomSanitizer } from '@angular/platform-browser';
import { CanvasDraw } from "../photo/canvasdraw";

@Component({
  selector: 'page-add-story',
  templateUrl: 'add-story.html'
})
export class AddStoryPage {

  recording: boolean = false;
  srcPhoto;
  segment = "gallery";
  images = [];
  selectedPhoto;
  selectedPhotoMedium;
  tabBarElement: any;


  @ViewChild(Content)
  content: Content;

  @ViewChild('myCanvasDraw')
  canvas: CanvasDraw

  constructor(public navCtrl: NavController,
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform,
    private photoLibrary: PhotoLibrary,
    private imageService: ImageService,
    private viewController: ViewController,
    private unsplash: UnsplashItUtil,
    private app: App,
    private loadingProvider: LoadingProvider,
    // private mediaCapture: MediaCapture,
    private dataProvider: DataProvider,
    private storyService: StoryService,
    private imageProvider: ImageProvider,
    private sanitizer: DomSanitizer,

  ) {

    let self = this;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    let photo: any = document.querySelector('.scroll-content');
    photo.style.backgroundColor = 'transparent';


  }

  flashMode = "off";
  user: any;

  changeSegment(value) {
    this.segment = value;

    if (value == "photo" || value == 'video') {
      this.startCamera();
    } else {
      this.stopCamera();
    }
  }

  flash() {

    if (this.flashMode == 'off') {
      this.flashMode = 'on'
    } else {
      this.flashMode = 'off'
    }

    this.setFlashMode();

  }

  setFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode).then(() => {

    }).catch(() => {

    });
  }

  takePicture() {

    let self = this;
    if (this.segment === 'video') {
      // if (!this.recording) {
      //   this.recording = true;
      //   let options: CaptureVideoOptions = { limit: 1, duration: 60 };
      //   this.mediaCapture.captureVideo(options)
      //     .then(
      //       (data: MediaFile[]) => {
      //         console.log(data);
      //         this.recording = false;
      //       },
      //       (err: CaptureError) => {
      //         console.error(err)
      //         this.recording = false;
      //       }
      //     );
      // }

    } else {


      const pictureOpts = {
        quality: 60,
        width: 640,
        height: 640,
      };

      this.cameraPreview.takePicture(pictureOpts).then(base64PictureData => {


        self.srcPhoto = "data:image/jpeg;base64," + base64PictureData;

        this.navCtrl.push(ShowPhoto, { photo: self.srcPhoto, story: true });
        self.cameraPreview.hide().then(() => {

        })


      });
    }
  }



  ionViewWillEnter() {
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      console.log(this.user)
    });

    this.tabBarElement.style.display = 'none';
    this.loadingProvider.show();
    this.images = [];
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach((libraryItem) => {
            console.log(libraryItem);
            this.images.push({ thumbnailUrl: libraryItem.thumbnailURL, mediumSizeUrl: libraryItem.photoURL });
            // console.log(libraryItem.id);          // ID of the photo
            // console.log(libraryItem.photoURL);    // Cross-platform access to photo
            // console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            // console.log(libraryItem.fileName);
            // console.log(libraryItem.width);
            // console.log(libraryItem.height);
            // console.log(libraryItem.creationDate);
            // console.log(libraryItem.latitude);
            // console.log(libraryItem.longitude);
            // console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => {
          console.log('could not get photos');
          this.loadingProvider.hide();
        },
        complete: () => {
          this.loadingProvider.hide();
          console.log('done getting photos');
          this.selectedPhotoMedium = this.images[0].mediumSizeUrl;
          this.selectedPhoto = this.images[0].mediumSizeUrl;
        }
      });
    })
      .catch(err => {
        console.log('permissions weren\'t granted', err)
        this.loadingProvider.hide();


      });

    if (this.segment == 'photo') {
      this.startCamera();
    }

  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  share() {
    this.loadingProvider.show();
    let img: any;
    if (this.selectedPhoto.startsWith('cdvphotolibrary://')) {
      img = this.sanitizer.bypassSecurityTrustUrl(this.selectedPhoto);
      // var ctx: CanvasRenderingContext2D;
      // let elem = <HTMLElement>document.querySelector(".tabbar");
      let c: any = <HTMLElement>document.createElement("canvas");
      var ctx: any = c.getContext('2d');
      var image = new Image(this.platform.width(), this.platform.height());
      // image.width = ;
      c.width = this.platform.width();
      c.height = this.platform.height();
      image.src = this.selectedPhoto;
      // ctx.canvas.width = image.width;
      // ctx.canvas.height = image.height;
      // ctx.drawImage(image, 0, 0, self.platform.width(), self.platform.height());      
      console.log('Width', this.platform.width());
      console.log('Height', this.platform.height());
      console.log('i.Width', image.width);
      console.log('i.Height', image.height);
      const width = this.platform.width();
      const height = this.platform.height();
      ctx.drawImage(image, 10, 10,width,height);
      img = ctx.canvas.toDataURL();
    } else {
      img = this.selectedPhoto;
    }
    console.log(img);
    this.imageProvider.uploadStoryImage(img).then((url) => {
      console.log('photo path', url);
      this.storyService.addStory({
        image: url,
        userName: this.user.name,
        userPhoto: this.user.img
      }).then((res) => this.navCtrl.pop());
    });
  }

  changePhoto(newImage) {
    // this.selectedPhotoMedium = newImage.mediumSizeUrl;
    this.selectedPhoto = newImage.mediumSizeUrl;
    this.content.scrollToTop(300);

  }


  back() {
    try {
      this.navCtrl.parent.select(0);
      // this.app.getRootNav().getActiveChildNav().select(0);
      // this.viewController.dismiss();
    } catch (e) {

    }

  }

  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {

      });
    } catch (e) {

    }
  }

  getPosition() {
    return (this.platform.height() / 1.9) - 20
  }

  getHeight() {
    return this.platform.height() - this.getPosition() - 64;
  }



  startCamera() {


    this.stopCamera();

    this.setFlashMode();

    // start camera
    console.log(this.platform.width(), this.platform.height());

    this.cameraPreview.startCamera({
      x: 0,
      y: 44,
      width: this.platform.width(),
      height: this.platform.height() / 1.9,
      toBack: true,
      previewDrag: false,
      tapPhoto: true
    }).then(() => {
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })

  }

  refresh() {
    this.cameraPreview.switchCamera();
  }

}
