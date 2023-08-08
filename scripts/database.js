(function name() {
  const firebaseConfig = {
    apiKey: "AIzaSyC8TCAQbzPITy*********_cUP5qots",
    authDomain: "je*****ey.firebaseapp.com",
    databaseURL: "https://*********-default-rtdb.firebaseio.com",
    projectId: "******-******",
    storageBucket: "*****.appspot.com",
    messagingSenderId: "627********7872",
    appId: "1:*********:web:*********************",
  };

  // Initialize Firebase
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    console.log(error);
  }

  firebase
    .auth()
    .signInAnonymously()
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
})();
