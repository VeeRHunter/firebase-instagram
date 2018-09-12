import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, provideLocationStrategy } from 'ionic-angular';
import { AddPostPage } from '../add-post/add-post';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { FirebaseProvider } from '../../providers/firebase';
import _ from 'lodash';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { CommentsPage } from '../comments/comments';
import { ImageModalPage } from '../image-modal/image-modal';
import { MessagesPage } from '../messages/messages';
import { UserInfoPage } from '../user-info/user-info';
import { StoryService } from '../../providers/story.service';
import { AddStoryPage } from '../../pages/add-story/add-story';
import { InterestTimelinePage } from '../../pages/interest-timeline/interest-timeline';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TabsService } from "../../util/tabservice";
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';



@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})



export class TimelinePage {
  private user: any;
  public timelineData: any;
  public friendsList: any;
  tabBarElement: any;
  private unreadGroupMessagesCount: any;
  private conversationList: any;
  private conversationsInfo: any;
  private unreadMessagesCount: any;
  myElement: any = null;
  zukeModal: any = null;
  storyList: any = null;
  skin = "Snapgram";
  skins: any = {
    'Snapgram': {
      'avatars': true,
      'list': false,
      'autoFullScreen': false,
      'cubeEffect': true
    },

    'VemDeZAP': {
      'avatars': false,
      'list': true,
      'autoFullScreen': false,
      'cubeEffect': false
    },

    'FaceSnap': {
      'avatars': true,
      'list': false,
      'autoFullScreen': true,
      'cubeEffect': false
    },

    'Snapssenger': {
      'avatars': false,
      'list': false,
      'autoFullScreen': false,
      'cubeEffect': false
    }
  };

  @ViewChild(Content)
  content: Content;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public firebaseProvider: FirebaseProvider,
    private nativeGeocoder: NativeGeocoder,
    public modalCtrl: ModalController,
    public storyService: StoryService,
    private sanitizer: DomSanitizer,
    private elmRef: ElementRef,
    private tabService: TabsService,
    private zone: NgZone) {

  }

  private animator: AnimationBuilder;



  @ViewChild('stories')
  stories: ElementRef



  goMessages() {
    this.navCtrl.push(MessagesPage);
  }

  goStory() {
    this.navCtrl.push(AddStoryPage);
  }

  getUnreadMessagesCount() {
    if (this.unreadMessagesCount) {
      if (this.unreadMessagesCount > 0) {
        return this.unreadMessagesCount;
      }
    }
    return null;
  }

  // Add or update conversaion for real-time sync of unreadMessagesCount.
  addOrUpdateConversation(conversation) {
    if (!this.conversationList) {
      this.conversationList = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].$key == conversation.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversationList[index] = conversation;
      } else {
        this.conversationList.push(conversation);
      }
    }
    this.computeUnreadMessagesCount();
  }

  // Compute all conversation's unreadMessages.
  computeUnreadMessagesCount() {
    this.unreadMessagesCount = 0;
    if (this.conversationList) {
      for (var i = 0; i < this.conversationList.length; i++) {
        this.unreadMessagesCount += this.conversationList[i].messages.length - this.conversationsInfo[i].messagesRead;
        if (this.unreadMessagesCount == 0) {
          this.unreadMessagesCount = null;
        }
      }
    }
  }





  load() {
    //get timelines   

    // console.log("load Timeline");

    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.timelineData = [];
      var timelineIds = [firebase.auth().currentUser.uid];
      // console.log('timelineids', timelineIds);

      this.user = user;
      if (this.user.following && timelineIds) {
        timelineIds = [...timelineIds, ...this.user.following];
      } else {
        if (this.user.following)
          timelineIds = [...this.user.following];
      }
      // console.log('Ids', timelineIds);
      if (timelineIds) {
        this.timelineData = [];
        this.loadingProvider.show();
        timelineIds.forEach(userId => {

          this.dataProvider.getInterests(userId).subscribe((data) => {
            // console.log('POSTLIST', data);
            var timelineList = data;
            if (timelineList) {
              timelineList.forEach(postId => {

                this.dataProvider.getTimeline(postId.$value).subscribe((post) => {
                  // this.timelineData = [];

                  this.loadingProvider.hide();
                  // console.log('POST', post);


                  let timeline = post;
                  let tempData = <any>{};
                  tempData = timeline;


                  this.dataProvider.getUser(userId).subscribe((user) => {
                    tempData.avatar = user.img;
                    tempData.name = user.name
                  });

                  //Check Location
                  if (timeline.location && timeline.location !== "Mohali") {
                    let tempLocaion = JSON.parse(timeline.location);
                    tempData.lat = tempLocaion.lat;
                    tempData.long = tempLocaion.long;
                    this.locationAddress(tempLocaion, (address: any) => {
                      tempData.locationAddress = address.locality + ", " + address.countryCode;
                      // console.log(tempData.locationAddress);
                    });
                  }

                  //  ===== check like
                  this.dataProvider.getLike(tempData.$key).subscribe((likes) => {
                    tempData.likes = likes.length;
                    // Check post like or not

                    let isLike = _.findKey(likes, (like) => {
                      let _tempLike = <any>like;
                      return _tempLike.$value == firebase.auth().currentUser.uid;
                    })

                    if (isLike) {
                      tempData.isLike = true;
                    } else {
                      tempData.isLike = false;
                    }
                  });

                  //  ===== check commnets
                  this.dataProvider.getComments(tempData.$key).subscribe((comments) => {
                    // // console.log("====comm",comments)
                    tempData.comments = comments.length;
                    // Check post like or not

                    let isComments = _.findKey(comments, (comment) => {
                      let _tempComment = <any>comment;
                      return _tempComment.commentBy == firebase.auth().currentUser.uid;
                    })

                    if (isComments) {
                      tempData.isComment = true;
                    } else {
                      tempData.isComment = false;
                    }

                  });

                  console.log("tempData");
                  console.log(tempData);

                  tempData.postText = this.createHashtag(tempData.postText);
                  // // this.timelineData.unshift(tempData);
                  let elem = <HTMLElement>document.querySelector(".tabbar");
                  if (elem != null) {
                    elem.style.display = 'flex';
                  }

                  this.addOrUpdateTimeline(tempData);
                  // let hash = document.getElementById('hashtagevt');
                  // if (hash)
                  //   hash.addEventListener('click', this.searchByHashTag.bind(this));

                  if (this.elmRef.nativeElement.querySelector('hashtagevt')) {
                    // console.log('HASH', this.elmRef.nativeElement.querySelector('hashtagevt'))
                    this.elmRef.nativeElement.querySelector('hashtagevt').addEventListener('click', alert(this));
                  }

                  // this.timelineData.unshift(tempData);
                  // // console.log(this.timelineData.length);                  
                  // if (this.timelineData.length > 1)
                  //   this.timelineData.splice(this.timelineData.length -1 , 1);
                  if (this.timelineData) {
                    this.timelineData.sort(function (a, b) {
                      var d1 = new Date(a.dateCreated);
                      var d2 = new Date(b.dateCreated);
                      // console.log('d1', d1);
                      // console.log('d2', d2);

                      return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
                    });
                  }

                });
                this.loadingProvider.hide();

              });
            }
          });
        });


      } else { this.loadingProvider.hide(); }
    })


  }



  ionViewWillEnter() {


    // console.log("ionViewWillEnter Timeline");

    this.angularDb.list('story').subscribe((stories) => {
      // console.log('destroy');
      this.myElement = null;
      this.zukeModal = null;
      this.storyList = null;
      // console.log('create');

      this.myElement = (<HTMLDivElement>document.getElementById("stories"));

      this.myElement.innerHTML = "";

      this.zukeModal = (<HTMLDivElement>document.getElementById("zuck-modal"))
      if (this.zukeModal) {

        if (this.zukeModal.parentNode) {
          this.zukeModal.parentNode.removeChild(this.zukeModal);
        }

      }


      let feeds = [];
      // console.log('Story List', stories);
      stories.forEach(story => {
        let feed = {
          id: story.$key,
          photo: story.photo,
          name: story.name,
          link: story.link,
          lastUpdated: story.lastUpdated,
          items: []
        }

        // console.log('building feed', feed);

        story.items.forEach((item, index) => {
          const objItem = { id: index, ...item };
          // console.log('Building items', objItem);
          feed.items.push(objItem);
        })
        feeds.unshift(feed);
      });

      this.storyList = new (<any>window).Zuck('stories', {
        backNative: true,
        autoFullScreen: this.skins[this.skin]['autoFullScreen'],
        skin: this.skin,
        avatars: this.skins[this.skin]['avatars'],
        list: this.skins[this.skin]['list'],
        cubeEffect: this.skins[this.skin]['cubeEffect'],
        localStorage: true,
        stories: feeds
      });




      this.loadingProvider.hide();
      // this.feeds = stories;
      // console.log('Stories OBJ', feeds);

    });


    this.loadingProvider.show();
    this.timelineData = null;
    this.load();
    this.loadingProvider.hide();
  }
  ionViewDidEnter() {
    // console.log("ionViewDidEnter Timeline");
    // let elem = <HTMLElement>document.querySelector(".tabbar");
    // if (elem != null) {
    //   elem.style.display = 'flex';
    // }
    this.tabService.show();
  }
  ionViewDidLoad() {

    //conversation count
    // console.log("ionViewDidLoad Timeline");
    this.dataProvider.getConversations().subscribe((conversationsInfo) => {
      this.unreadMessagesCount = null;
      this.conversationsInfo = null;
      this.conversationList = null;
      if (conversationsInfo.length > 0) {
        this.conversationsInfo = conversationsInfo;
        conversationsInfo.forEach((conversationInfo) => {
          this.dataProvider.getConversation(conversationInfo.conversationId).subscribe((conversation) => {
            if (conversation.$exists()) {
              this.addOrUpdateConversation(conversation);
            }
          });
        });
      }
    });

    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.    

    this.loadingProvider.show();
    this.createUserData();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      // console.log("this.user");
      // console.log(this.user);
    });
    this.tabService.show();




    //this.load();  



  }

  // Create userData on the database if it doesn't exist yet.
  createUserData() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).once('value')
      .then((account) => {
        // No database data yet, create user data on database
        if (!account.val()) {
          this.loadingProvider.show();
          let user = firebase.auth().currentUser;
          // console.log("user");
          // console.log(user);
          //debugger

          var userId, name, provider, img, email;
          let providerData = user.providerData[0];

          userId = user.uid;

          // Get name from Firebase user.
          if (user.displayName || providerData.displayName) {
            name = user.displayName;
            name = providerData.displayName;
          } else {
            name = "Firebase User";
          }

          // Set default username based on name and userId.
          let username = name.replace(/ /g, '') + userId.substring(0, 8);

          // Get provider from Firebase user.
          if (providerData.providerId == 'password') {
            provider = "Firebase";
          } else if (providerData.providerId == 'facebook.com') {
            provider = "Facebook";
          } else if (providerData.providerId == 'google.com') {
            provider = "Google";
          } else if (providerData.providerId == 'phone') {
            provider = "Phone";
          }

          // Get photoURL from Firebase user.
          if (user.photoURL || providerData.photoURL) {
            img = user.photoURL;
            img = providerData.photoURL;
          } else {
            img = "assets/images/profile.png";
          }

          // Get email from Firebase user.
          email = user.email ? user.email : user.phoneNumber;

          // Set default description.
          let description = "Hello! I am a new facebookclone user.";
          // console.log({
          //   userId: userId,
          //   name: name,
          //   username: username,
          //   provider: provider,
          //   img: img,
          //   email: email,
          //   description: description,
          //   dateCreated: new Date().toString()
          // });
          debugger

          // Insert data on our database using AngularFire.
          this.angularDb.object('/accounts/' + userId).set({
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            dateCreated: new Date().toString()
          }).then(() => {
            this.loadingProvider.hide();
          });
        }
      });
  }

  // Add or update timeline data for real-time sync.
  addOrUpdateTimeline(timeline) {
    if (!this.timelineData) {
      this.timelineData = [timeline];
    } else {
      var index = -1;
      for (var i = 0; i < this.timelineData.length; i++) {
        // console.log('addorupdate1', this.timelineData[i]);
        // console.log('addorupdate2', timeline);

        if (this.timelineData[i].$key === timeline.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.timelineData[index] = timeline;
      } else {
        this.timelineData.unshift(timeline);
      }
    }
  }

  //Create Hashtag Links
  createHashtag(text: String): SafeHtml {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    // res.forEach(function (val) {
    //   // console.log(val.substring(0, 1));
    //   if (val.substring(0, 1) === '#') {
    //     let index = res.indexOf(val);
    //     res[res.indexOf(val)] = ' <a  id="hashtagevt" class="hashtagevt">' + val + ' </a>';
    //     // console.log(res[index]);
    //   }
    // });
    return res;//this.sanitizer.bypassSecurityTrustHtml(res.join().replace(/,/g, " "));
  }

  searchByHashTag(val) {
    // console.log('go search');

    this.navCtrl.push(InterestTimelinePage, { hashtag: val, hash: true });
  }

  addPost() {
    this.navCtrl.push(AddPostPage)
  }

  likePost(post) {
    this.firebaseProvider.likePost(post.$key)
  }

  bookmarkPost(post) {
    console.log(post.$key);
    this.firebaseProvider.bookmarkPost(post.$key);
  }

  isFavorite(post) {
    const { bookmark } = this.user;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.$key) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    this.firebaseProvider.delikePost(post.$key)
  }

  commentPost(post) {
    // console.log("post");
    // console.log(post);
    let modal = this.modalCtrl.create(CommentsPage, { postKey: post.$key });
    modal.present();
  }

  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  locationAddress(location, success) {

    this.nativeGeocoder.reverseGeocode(location.lat, location.long)
      .then((result) => {
        // console.log("JSON.stringify(result)");
        // console.log(JSON.stringify(result));
        success(result);
      }).catch((error: any) => console.log(error)
      );
  }

  //View User  
  viewUser(userId) {
    this.navCtrl.push(UserInfoPage, { userId: userId });
  }

}
