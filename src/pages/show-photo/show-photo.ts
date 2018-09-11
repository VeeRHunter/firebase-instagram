import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { filter } from "rxjs/operator/filter";
import { FilterService } from "../../util/filterservice";
import { PublishPage } from "../publish/publish";
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { StoryService } from '../../providers/story.service';

/**
 * Generated class for the ShowPhoto page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-show-photo',
  templateUrl: 'show-photo.html',
})
export class ShowPhoto {

  filter;
  filters = [
    { name: "normal", class: "normal", filter: "" },
    { name: "clarendon", class: "clarendon", filter: "contrast(1.2) saturate(1.35)" },
    { name: "gingham", class: "gingham", filter: "brightness(1.05) hue-rotate(-10deg)" },
    { name: "moon", class: "moon", filter: "grayscale(1) contrast(1.1) brightness(1.1)" },
    { name: "lark", class: "lark", filter: "contrast(.9)" },
    { name: "reyes", class: "reyes", filter: "sepia(.22) brightness(1.1) contrast(.85) saturate(.75)" },
    { name: "slumber", class: "slumber", filter: "saturate(.66) brightness(1.05)" },
    { name: "aden", class: "aden", filter: "hue-rotate(-20deg) contrast(.9) saturate(.85) brightness(1.2)" },
    { name: "perpetua", class: "perpetua", filter: "" },
    { name: "mayfair", class: "mayfair", filter: "contrast(1.1) saturate(1.1)" },
    { name: "rise", class: "rise", filter: "brightness(1.05) sepia(.2) contrast(.9) saturate(.9) " },
    { name: "hudson", class: "hudson", filter: "brightness(1.2) contrast(.9) saturate(1.1)" },
    { name: "valencia", class: "valencia", filter: "contrast(1.08) brightness(1.08) sepia(0.08)" },
    { name: "xpro2", class: "xpro2", filter: "sepia(.3)" },
    { name: "willow", class: "willow", filter: "grayscale(.5) contrast(.95) brightness(.9)" },
    { name: "lofi", class: "lofi", filter: "saturate(1.1) contrast(1.5)" },
    { name: "inkwell", class: "inkwell", filter: "sepia(.3) contrast(1.1) brightness(1.1) grayscale(1)" },
    { name: "nashville", class: "nashville", filter: "sepia(.2) contrast(1.2) brightness(1.05) saturate(1.2)" },
    { name: "stinson", class: "stinson", filter: "contrast(0.75) saturate(0.85) brightness(1.15)" },
    { name: "earlybird", class: "earlybird", filter: "contrast(.9) sepia(.2)" },
    { name: "brannan", class: "brannan", filter: "sepia(0.5) contrast(1.4)" },
    { name: "toaster", class: "toaster", filter: "contrast(1.5) brightness(.9)" },
    { name: "walden", class: "walden", filter: "brightness(1.1) hue-rotate(-10deg) sepia(.3) saturate(1.6)" },
    { name: "1997", class: "_1977", filter: " contrast(1.1) brightness(1.1) saturate(1.3)" },
    { name: "kelvin", class: "kelvin", filter: "" },
    { name: "maven", class: "maven", filter: "sepia(.25) brightness(.95) contrast(.95) saturate(1.5)" },
    { name: "brooklyn", class: "brooklyn", filter: "contrast(.9) brightness(1.1)" },
  ];

  customFilters = [
    { name: "brightness", filter: "brightness", icon: "ios-sunny-outline" },
    { name: "contrast", filter: "contrast", icon: "ios-contrast-outline" },
    { name: "saturation", filter: "saturate", icon: "ios-water-outline" },
    { name: "fade", filter: "opacity", icon: "ios-cloud-outline" },
    // {name: "shadows", icon: "ios-star-half-outline"},

  ]

  src;
  user: any;
  story: boolean = false;
  mode = "filter"
  tempFlter = ""
  imageStyleFilter = "";
  brightness = 0;
  contrast = 0;
  saturation = 0;
  fade = 0;
  actualView = "default";
  title;


  @ViewChild(Content)
  content: Content;

  @ViewChild("imageFilter")
  image: HTMLImageElement;
  private hasEvent;

  private backupFilter = "";
  private backupVariable;

  constructor(public navCtrl: NavController, public navParams: NavParams, private filterService: FilterService,
              public dataProvider : DataProvider, public loadingProvider : LoadingProvider, public storyService : StoryService) {
    this.src = this.navParams.get('photo');
    let story = this.navParams.get('story');
    if (story)
      this.story = story;


    this.filterService.init()
    this.filter = this.filters[0]
  }

  ionViewWillEnter() {
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      console.log(this.user)
    });
  }

  changeView(newView, title) {

    this.backupFilter = this.getCurrentFilter();
    this.backupVariable = this[newView];

    setTimeout(() => {
      this.actualView = newView;
      this.title = title;
      this.content.resize();
      ///your code here
    }, 1);

  }

  // Our tracking function
  public trackByFunction(index, item) {
    // here we will provide the item id
    if (!item) return null;

    return item.name;

  }

  back() {

    if (this.isCustomFilter()) {

      this.changeView("edit", "");

    } else {
      this.navCtrl.pop();
    }


  }

  press($event) {

    let image = (<HTMLImageElement>document.getElementById("imageFilter"))
    this.imageStyleFilter = image.style.filter;
    image.style.filter = ""
    this.tempFlter = this.filter;

    this.filter = "";
    console.log("press", $event)
    this.hasEvent = true;
  }

  end() {

    if (this.hasEvent) {
      this.filter = this.tempFlter;
      let image = (<HTMLImageElement>document.getElementById("imageFilter"))
      image.style.filter = this.imageStyleFilter;

      console.log("end")
      this.hasEvent = false;
    }

  }

  next() {

    console.log("next");

    var c = (<HTMLDivElement>document.getElementById("imageFilter3"));
    var c2 = (<HTMLCanvasElement>document.getElementById("imageFilter2"));

    let img = this.findImage();

    c2.width = img.naturalWidth;
    c2.height = img.naturalHeight;

    console.log(c);

    var self = this;
    (<any>window).rasterizeHTML.drawHTML(c.innerHTML, c2).then(function success(renderResult) {
      var image = c2.toDataURL("image/png").replace("image/png", "image/octet-stream");
      console.log(self.story);      
      if (self.story) {
        self.loadingProvider.show();
        self.storyService.addStory({
          image: image,
          userName: self.user.name,
          userPhoto: self.user.img
        });
        self.navCtrl.popToRoot();

      } else {
        self.navCtrl.push(PublishPage, { image: image });
      }

    }, function error(e) {
      console.log(e);      
    });

    // var ctx = c.getContext("2d");
  }


  isCustomFilter() {
    return this.customFilters.findIndex(item => this.actualView == item.name) > -1;
  }


  isFilterUsed(filter) {
    return this.filterService.getCustomFilters().findIndex(item => item == filter) > -1
  }


  changeSegment(value) {
    this.actualView = value;
  }


  changeFilter(newFilter) {
    this.filter = newFilter;
    let currentFilter = this.getCurrentFilter();
    let filter = this.filterService.getStyleFilter(currentFilter, newFilter.filter, false);
    this.applyFilter(filter);
  }

  applyFilter(filter: string) {
    let image = this.findImage();
    image.style.filter = filter;
  }

  findImage(): HTMLImageElement {
    return (<HTMLImageElement>document.getElementById("imageFilter"));
  };

  getCurrentFilter() {
    let currentFilter = "";
    let image = this.findImage();
    if (image.style) {
      currentFilter = image.style.filter;
    }

    return currentFilter;
  }


  cancel() {

    let editView = 'edit';

    this.applyFilter(this.backupFilter);

    if (!this.filterService.areadyExistsChange(this.actualView, this.backupFilter)) {
      this[this.actualView] = null;
      this.filterService.removeCustomFilter(this.actualView, this.backupFilter);
    } else {
      this[this.actualView] = this.backupVariable;
    }

    this.backupFilter = "";

    setTimeout(() => {
      this.actualView = editView;
      this.content.resize();
    }, 1);

  }

  done() {
    let editView = 'edit';
    setTimeout(() => {
      this.actualView = editView;
      this.content.resize();
    }, 1);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowPhoto');
  }

}
