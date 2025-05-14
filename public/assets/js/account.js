function toggleMenu() {
    window.dispatchEvent(new Event("toggleMenu"));
}
  
function mouseHover(event) {
    if (event.clientX < 30) {
      window.dispatchEvent(new Event("showMenu"));
    }
}

const changeAccount = document.getElementById("changeAccount");
changeAccount.addEventListener("click", () => {
    window.openAccountModal();
});

window.addEventListener("updateUser", () => {
    init();
});

let auth = document.getElementById('auth');
function signOut() {
    if(auth.innerHTML === 'Log Out'){
        sessionStorage.setItem('email', '');
        auth.innerHTML = 'Log In';
        window.dispatchEvent(new Event('updateUser'));

        const message = document.getElementById("authMessage");
        message.innerHTML = 'Logged out Successfully'
        message.style.animation = "none";
        void message.offsetWidth;
        message.style.animation = "fadeOut 5s";
    } else {
        window.openAccountModal();
    }
}

function init() {
    const email = sessionStorage.getItem("email");
    const userEmail = document.getElementById("userEmail");
    if (email && email.trim() !== "" && email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )){
        userEmail.innerHTML = `Email : ${email}`;
        auth.innerHTML = 'Log Out';
    } else {
        userEmail.innerHTML = `Email : ???`;
        auth.innerHTML = 'Log In';
    }
}