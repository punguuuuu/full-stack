function toggleMenu() {
  window.dispatchEvent(new Event("toggleMenu"));
}

function mouseHover(event) {
  if (event.clientX < 30) {
    window.dispatchEvent(new Event("showMenu"));
  }
}

function changePage(page) {
  if (!window.location.pathname.includes(page)) {
    window.location.href = page;
  } else {
    console.warn(page + " does not exist");
  }
}

let gifPlaying = false;
function playGif() {
  if (gifPlaying) {
    return;
  }

  img = document.getElementById("gif");
  img.src = "./assets/images/spin.gif";
  gifPlaying = true;

  setTimeout(function () {
    img.src = "./assets/images/spin0.png";
    gifPlaying = false;
  }, 2150);
}

function submitText() {
  let inputText = document.querySelector(".lineEdit");
  let reward = document.getElementById("reward");
  let text = document.getElementById("message");

  text.innerHTML =
    inputText.value.trim() === ""
      ? "It's EMPTY !"
      : "Thanks ! Here's your reward :)";

  if (inputText.value.trim() !== "") {
    reward.style.height = "600px";

    emailjs
      .send(
        "service_eqflx1d",
        "template_smc934h",
        {
          time: new Date(),
          suggestion: inputText.value,
        },
        "LyjyTLGN4DHGtdTq1"
      )

      .then((response) => {
        console.log("Email sent successfully!", response);
      })

      .catch((error) => {
        console.error("Error sending email:", error);
      });
  } else {
    reward.style.height = "0px";
  }
}
