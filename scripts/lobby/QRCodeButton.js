let generateButton = document.querySelector(".button");

generateButton.addEventListener("click", () => {
  redirect();
});

function redirect() {
  let user_input = document.querySelector("#input_text");
  if (user_input.value != "") {
    location.href = `/views/lobby?IP=${user_input.value}`;
  } else {
    swal({
      title: "How can I say that?...",
      icon: "error",
      text: "You must type the local IP Addess, something like 999.999.9.999, normally it is 192.168.0.XXX",
    });
  }
}
