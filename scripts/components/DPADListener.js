(function () {
  document.getElementById("dpad-ok").addEventListener("click", () => {
    handleActionPress();
  });
  document.getElementById("dpad-up").addEventListener("click", () => {
    handleArrowPress(0, -1);
  });
  document.getElementById("dpad-right").addEventListener("click", () => {
    handleArrowPress(1, 0);
  });
  document.getElementById("dpad-down").addEventListener("click", () => {
    handleArrowPress(0, 1);
  });
  document.getElementById("dpad-left").addEventListener("click", () => {
    handleArrowPress(-1, 0);
  });
})();
