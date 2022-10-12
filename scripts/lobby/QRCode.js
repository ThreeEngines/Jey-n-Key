let qr_code_element = document.querySelector(".qr-code");

function generate() {
  let user_input = {
    value: `http://${urlParam("IP")}:8080/views/waitingroom`,
  };

  qr_code_element.style = "";
  qr_code_element.innerText = `${user_input.value}`;
  qr_code_element.innerHTML = "";

  var qrcode = new QRCode(qr_code_element, {
    text: `${user_input.value}`,
    width: QRCodeWidth, //128
    height: QRCodeHeight,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  let QRCodeImage = document.querySelector("img");
  let plainText = document.createElement("div");
  qr_code_element.appendChild(plainText);

  QRCodeImage.setAttribute("class", "qr-code-image");

  let plainTextLink = document.createElement("a");
  plainTextLink.setAttribute("class", "plain-text-link");
  plainTextLink.setAttribute("title", "Plain text waiting roomurl");
  plainTextLink.setAttribute("href", `${user_input.value}`)
  plainTextLink.innerText = `${user_input.value}`;

  plainText.appendChild(plainTextLink);
  disableLoader()
}
