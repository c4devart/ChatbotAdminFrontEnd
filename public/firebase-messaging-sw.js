importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js");

var config = {
  messagingSenderId: "492923284381"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();