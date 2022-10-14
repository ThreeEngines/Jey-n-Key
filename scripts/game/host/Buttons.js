const lobbyButton = document.getElementById("to-lobby");
const testButton = document.getElementById("player-test");
const playerIdField = document.getElementById("player-id");
const drillButton = document.getElementById("drill");

lobbyButton.addEventListener("click", () => {
  setStatusToWaitingRoom();
  const ip = window.localStorage.getItem("IP");
  location.href = `/views/lobby?IP=${ip}&playerId=${playerId}`;
});

drillButton.addEventListener("click", () => {
  drillHole();
});

testButton.addEventListener("click", () => {
  runtime();

  /* SEEKER */
  // setStatusToHide(playerIdField.value);

  /*- Kill */
  // let ref = firebase
  //   .database()
  //   .ref(`players/${GAMESET_GAMING}/${playerIdField.value}`);
  // databasePathExchange(ref, GAMESET_WATCHING);
});
