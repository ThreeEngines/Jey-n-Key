// Element needed to replace:
// <div id="dpad-component"></div>

function enableDPAD() {
  const dpadElement = document.getElementById("dpad-component");
  fetch("../../views/components/DPAD.html")
    .then((response) => response.text())
    .then((data) => {
      dpadElement.innerHTML = data;
    });
}
