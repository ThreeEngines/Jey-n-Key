let playersWaiting = {};
const list = document.getElementById("playersWaiting");

(function () {
  const allPlayersRef = firebase.database().ref(`players`);

  //New - not in the video!
  //This block will remove coins from local state when Firebase `coins` value updates

  allPlayersRef.on("value", (snapshot) => {
    playersWaiting = snapshot.val() || {};

    let listItems = "";
    Object.keys(playersWaiting).forEach((key) => {
      listItems += `<li id='${key}'class='listItem'>${playersWaiting[key].name}</li>`;
    });

    list.innerHTML = listItems;
  });

  //Updates player name with text input
  playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value || createName();
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

  testButton.addEventListener("click", () => {
    drillHole();
  });
})();
