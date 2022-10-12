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
  // testButton.addEventListener("click", () => {
  //   drillHole();
  // });
})();
