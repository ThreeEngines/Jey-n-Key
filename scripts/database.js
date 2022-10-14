(function name() {
  const firebaseConfig = {
    apiKey: "AIzaSyC8TCAQbzPITyyBL5WcDtRnZe_cUP5qots",
    authDomain: "jeyndkey.firebaseapp.com",
    databaseURL: "https://jeyndkey-default-rtdb.firebaseio.com",
    projectId: "jeyndkey",
    storageBucket: "jeyndkey.appspot.com",
    messagingSenderId: "627657547872",
    appId: "1:627657547872:web:e1b9048102a2d1a07f6305",
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
