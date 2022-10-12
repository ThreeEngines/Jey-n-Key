(function () {
  //Updates player name with text input
  playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value.toUpperCase() || createName();
    playerNameInput.value = newName;
    playerRef.update({
      name: newName,
    });
  });

  //Update player color on button click
  playerColorButton.addEventListener("click", () => {
    const mySkinIndex = playerColors.indexOf(players[playerId].color);
    const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
    playerRef.update({
      color: nextColor,
    });
  });

  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    const gameset = snapshot.val();
    if (gameset.status === "START") {
      window.location.assign("/views/gameset");
      // location.href = `/views/gameset?player=${playerId}`;
    }
  });

  testButton.addEventListener("click", () => {
    console.log("Button clicked");
    const childRef = firebase
      .database()
      .ref("/players/XBG4qqE8VXYRigD4ArvTymLONh42");
    childRef.get().then((snapshot) => {
      snapshot.val().online == false ? childRef.remove() : null;
    });
  });
})();
