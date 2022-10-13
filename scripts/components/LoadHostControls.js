// Element needed to replace:
// <div id="hostconstrols-component"></div>

function enableHostControls() {
  const hostconstrols = document.getElementById("hostcontrols-component");
  const body = document.querySelector("body");
  fetch("../../views/components/HostControls.html")
    .then((response) => response.text())
    .then((data) => {
      hostconstrols.innerHTML = data;
    });

  setTimeout(() => {
    const script = document.createElement("script");
    script.setAttribute("src", "../../scripts/game/host/Buttons.js");
    body.appendChild(script);
  }, 500);
}
