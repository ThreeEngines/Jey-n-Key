const generateButton = document.getElementById("QRCode-Generate");
const input = document.getElementById("input_text");

generateButton.addEventListener("click", () => {
  redirectToWaitingRoom();
});

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    generateButton.click();
  }
});

function redirectToWaitingRoom() {
  let user_input = document.querySelector("#input_text");
  if (user_input.value != "") {
    location.href = `/views/lobby?IP=${user_input.value}`;
  } else {
    swal({
      title: "How can I say that?...",
      icon: "error",
      text: `You must type the local IP Addess, something like 999.999.999.999, normally it is 192.168.0.xxx
      \n\nThis information is shown when you started the server.`,
    });
  }
}
