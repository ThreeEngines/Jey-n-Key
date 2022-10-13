const lobbyButton = document.getElementById("to-lobby");
const testButton = document.getElementById("player-test");

lobbyButton.addEventListener("click", () => {
  setStatusToWaitingRoom();
  const ip = window.localStorage.getItem("IP");
  location.href = `/views/lobby?IP=${ip}&playerId=${playerId}`;
});

testButton.addEventListener("click", () => {
  if (gamesetStatus == GAMESET_HIDE)
    setStatusToSeek("XBG4qqE8VXYRigD4ArvTymLONh42");
  else setStatusToHide("XBG4qqE8VXYRigD4ArvTymLONh42");
  console.log(gamesetStatus);
});
