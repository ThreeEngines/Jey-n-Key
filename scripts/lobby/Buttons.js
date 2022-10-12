const startGameButton = document.getElementById("Start-Game");
const gamesetRef = firebase.database().ref(`gameset`);

function preparingSet() {
  gamesetRef.set({
    status: "PREPARING",
    timer: "",
    rounds: 0,
  });
}

startGameButton.addEventListener("click", () => {
  gamesetRef.set({
    status: "START",
    timer: "",
    rounds: 0,
  });
});
