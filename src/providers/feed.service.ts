
import {Injectable} from '@angular/core';

@Injectable()
export class FeedService {
  feeds: any;

  

  constructor() {

    


    this.feeds = [      
    ]

  }


  getFeed(): any[] {
    return this.feeds;
  }

  addFeed(obj : any) {
    this.feeds.unshift(obj);
  }

}
