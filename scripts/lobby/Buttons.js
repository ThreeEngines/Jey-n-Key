const startGameButton = document.getElementById("Start-Game");

startGameButton.addEventListener("click", () => {
  if (itemCount < 4) {
    swal({
      title: "That many people?",
      icon: "warning",
      buttons: ["I'll wait!", "Go for it!"],
      text: "With few friends maybe not so much fun.",
    }).then(function (isConfirm) {
      if (isConfirm) {
        setStatusToLoading();
        location.href = `/views/gameset?playerId=${playerId}`;
      }
    });
  } else {
    setStatusToLoading();
    location.href = `/views/gameset?playerId=${playerId}`;
  }
});
