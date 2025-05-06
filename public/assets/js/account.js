function toggleMenu() {
    window.dispatchEvent(new Event("toggleMenu"));
}
  
function mouseHover(event) {
    if (event.clientX < 30) {
      window.dispatchEvent(new Event("showMenu"));
    }
}

const changeEmail = document.getElementById("changeEmail");

changeEmail.addEventListener("click", () => {
    window.openEmailModal();
});

window.addEventListener("updateUser", () => {
    init();
});

function init() {
    const email = sessionStorage.getItem("email");
    const userEmail = document.getElementById("userEmail");
    if (email && email.trim() !== "" && email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )){
        userEmail.innerHTML = `Email : ${email}`;
    } else {
        userEmail.innerHTML = `Email : ???`;
    }
}