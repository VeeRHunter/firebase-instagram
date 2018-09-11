import {Injectable} from '@angular/core';

// Declare TabsService as a provider in app.module.ts
// Inject TabsService in your class: constructor(public tabs: TabsService){}
// Use the this.tabs.hide() or this.tabs.show() methods wherever you want
@Injectable()
export class TabsService {
  tabs: any;
  constructor() {
    this.tabs = document.querySelectorAll('.tabbar');
  }

  public hide() {
    // let 
    let scrollContent = document.querySelectorAll('.scroll-content');
    if (this.tabs !== null) {
      Object.keys(this.tabs).map((key) => {
        this.tabs[key].style.display = 'none';
      });

      // fix for removing the margin if you got scorllable content
      // setTimeout(() =>{
      //   Object.keys(scrollContent).map((key) => {
      //     scrollContent[key].style.marginBottom = '0';
      //   });
      // })
    }
  }

  public show() {
    // let tabs = document.querySelectorAll('.tabbar');
    console.log('tab service is showed');
    if (this.tabs !== null) {
      Object.keys(this.tabs).map((key) => {
        console.log('key:' + key);
        this.tabs[key].style.display = 'flex';
      });
    }
  }
}
