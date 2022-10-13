(function () {
  // Updates player name with text input
  playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value.toUpperCase() || createName();
    playerNameInput.value = newName;
    playerName = newName;
    playerRef.update({
      name: newName,
    });
  });

  // Update player color on button click
  playerColorButton.addEventListener("click", () => {
    playerRef.get().then((snapshot) => {
      const mySkinIndex = playerColors.indexOf(player.color);
      const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
      playerColor = nextColor;
      playerRef.update({
        color: nextColor,
      });
    });
  });

  // Verify the gameset status
  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    const gameset = snapshot.val();
    if (gameset.status === GAMESET_LOADING) {
      location.href = `/views/gameset`;
    }
  });

  // REMOVE THE TEST BUTTON WHEN FINISH TESTING
  const testButton = document.getElementById("player-test");
  testButton.addEventListener("click", () => {
    const childRef = firebase
      .database()
      .ref("/players/XBG4qqE8VXYRigD4ArvTymLONh42");
    childRef.get().then((snapshot) => {
      snapshot.val().online == false ? childRef.remove() : null;
    });
  });
})();
