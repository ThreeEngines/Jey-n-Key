const lobbyButton = document.getElementById("to-lobby");
const testButton = document.getElementById("player-test");

lobbyButton.addEventListener("click", () => {
  setStatusToWaitingRoom();
  const ip = window.localStorage.getItem("IP");
  location.href = `/views/lobby?IP=${ip}&playerId=${playerId}`;
});

testButton.addEventListener("click", () => {
  console.log("oi?");
  let ref = firebase
    .database()
    .ref(`players/${GAMESET_GAMING}/MIcNDGpcQFOiH3KuqfPGr30umIz21665705958178`);
  databasePathExchange(ref, GAMESET_WATCHING);
});
