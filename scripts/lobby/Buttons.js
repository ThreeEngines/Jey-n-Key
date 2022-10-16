const startGameButton = document.getElementById("Start-Game");

startGameButton.addEventListener("click", () => {
  if (itemCount < 4) {
    swal({
      title: "That many people?",
      icon: "warning",
      buttons: ["I'll wait!", "Go for it!"],
      text: "With few friends maybe not be that much fun.",
    }).then(function (isConfirm) {
      if (isConfirm) {
        setStatus(GAMESET_LOADING, undefined);
        location.href = `/views/gameset?playerId=${playerId}`;
      }
    });
  } else {
    setStatus(GAMESET_LOADING, undefined);
    location.href = `/views/gameset?playerId=${playerId}`;
  }
});
