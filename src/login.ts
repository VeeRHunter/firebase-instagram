// Login Constants.
// This file contains all your Firebase settings, and app routes.
// It's important to set in your Firebase, Facebook, and Google app credentials here.
// If you have a different view for the homePage, trialPage, and verificationPage
// You can import them here and set them accordingly.
// If you want to disable emailVerification, simply set it to false.

import { TabsPage } from './pages/tabs/tabs';
import { VerificationPage } from './pages/verification/verification';
import { TrialPage } from './pages/trial/trial';
import { LoginPage } from './pages/login/login';

export namespace Login {
  // Get your Firebase app's config on your Firebase console. "Add Firebase to your web app".
  export const firebaseConfig = {

    // apiKey: "AIzaSyBQ4bPqg1wKFswPRcMh8I4yVY5lQayGyPw",
    // authDomain: "instagramclone-18809.firebaseapp.com",
    // databaseURL: "https://instagramclone-18809.firebaseio.com",
    // projectId: "instagramclone-18809",
    // storageBucket: "instagramclone-18809.appspot.com",
    // messagingSenderId: "1021716760482"
    apiKey: "AIzaSyBWZbSJSBOj-T0B1dlrUdZ1pZpnoXXkjPE",
    authDomain: "pask-3b58f.firebaseapp.com",
    databaseURL: "https://pask-3b58f.firebaseio.com",
    projectId: "pask-3b58f",
    storageBucket: "pask-3b58f.appspot.com",
    messagingSenderId: "216913801893"

  };
  // Get your Facebook App Id from your app at http://developers.facebook.com
  export const facebookAppId: string = ""; // 1025234637591184

  //  LIVE ACCOUNT MAKE SURE TO GET THE client_id OF client_type 3 and NOT client_type 1!!!
  // export const googleClientId: string ="277373824972-lbl3fm2n204a3oreegisp5an1qko1fm6.apps.googleusercontent.com"

  // TESTing account
  // export const googleClientId: string ="854823107381-k0er0frh6q3s7msa4o2ovk14v89tj13h.apps.googleusercontent.com"
  export const googleClientId: string = ""

  // Set in your appropriate Login routes, don't forget to import the pages on app.module.ts
  export const homePage = TabsPage;
  export const verificationPage = VerificationPage;
  export const trialPage = TrialPage;
  export const loginpage = LoginPage;
  // Set whether emailVerification is enabled or not.
  export const emailVerification: boolean = true;
}
