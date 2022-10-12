(function () {

  firebase.auth().onAuthStateChanged((user) => {
    // console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        name,
        direction: "right",
        color: randomFromArray(playerColors),
        x,
        y,
      });

      
      refreshWaitingList()
      disableLoader()

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();
    } else {
      //You're logged out.
    }
  });

})();
