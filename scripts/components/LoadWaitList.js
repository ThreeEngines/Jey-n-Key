// Element needed to replace:
// <div id="waitlist-component"></div>

(function () {
  const waitListElement = document.getElementById("waitlist-component");
  const body = document.querySelector("body");
  fetch("../../views/components/WaitingList.html")
    .then((response) => response.text())
    .then((data) => {
      waitListElement.innerHTML = data;
    });
  const script = document.createElement("script");
  script.setAttribute("src", "../../scripts/waitingroom/WaitingList.js");
  body.appendChild(script);
})();
