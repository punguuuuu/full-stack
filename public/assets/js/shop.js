function toggleMenu() {
  window.dispatchEvent(new Event("toggleMenu"));
}

function mouseHover(event) {
  if (event.clientX < 30) {
    window.dispatchEvent(new Event("showMenu"));
  }
}

let toTopBtn = document.getElementById("toTopBtn");
window.onscroll = function () {
  if (
    document.body.scrollTop > 1000 ||
    document.documentElement.scrollTop > 1000
  ) {
    toTopBtn.style.width = "200px";
  } else {
    toTopBtn.style.width = 0;
  }
};

function toTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

let detail = document.getElementById("detail");
let addBtn = document.getElementById("addBtn");
let message = document.getElementById("message");
let quantity = document.getElementById("quantityValue");

function showDetail(show) {
  if (show) {
    showCart(false);
    detail.style.right = 0;
    message.style.opacity = 0;
    if (window.innerWidth >= 800 && window.innerWidth <= 1000) {
      main.style.marginRight = "350px";
    } else if (window.innerWidth >= 800) {
      main.style.marginRight = "500px";
    }
  } else {
    detail.style.right = "-800px";
    main.style.marginRight = 0;
  }

  setTimeout(() => {
    window.scrollTo(0, window.scrollY);
  }, 0);
}

function changeQuantity(increment) {
  if (increment) {
    quantity.innerHTML = parseInt(quantity.innerHTML) + 1;
  } else if (parseInt(quantity.innerHTML) > 1) {
    quantity.innerHTML = parseInt(quantity.innerHTML) - 1;
  }
}

let itemImg = document.getElementById("image");
let itemCaption = document.getElementById("caption");
let itemPrice = document.getElementById("price");
async function addToCart() {
  let addBtn = document.getElementById("addBtn");
  message.style.opacity = 0;
  window.cartQuantity = parseInt(quantity.innerHTML);

  const itemInfo = {
    name: itemCaption.innerHTML,
    price: parseFloat(itemPrice.innerHTML.replace("$ ", "")),
    quantity: Number(quantity.innerHTML),
    total: (
      parseFloat(itemPrice.innerHTML.replace("$ ", "")) *
      Number(quantity.innerHTML)
    ).toFixed(2),
    imagepath: itemImg.src,
    id: itemImg.alt,
  };

  if (validateEmail()) {
    addBtn.style.display = "none";
    const res = await fetch(
      `getCartItems?email=${encodeURIComponent(
        sessionStorage.getItem("email")
      )}`
    );
    const userCart = await res.json();
    const identicalItem = userCart.find((item) => item.name === itemInfo.name);
    if (identicalItem) {
      identicalItem.quantity += Number(quantity.innerHTML);
      fetch("updateQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: identicalItem.quantity,
          itemid: identicalItem.itemid,
          email: sessionStorage.getItem("email"),
        }),
      });
    } else {
      const res = await fetch("addItemToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: itemInfo,
          email: sessionStorage.getItem("email"),
        }),
      });
    }

    addBtn.style.display = "block";
    message.style.opacity = 1;
    window.dispatchEvent(new Event("update"));
  } else {
    window.openAccountModal();
    return;
  }
}

let warning = document.getElementById("warning");

function showCart(show) {
  let cart = document.getElementById("cart");
  if (show) {
    showDetail(false);
    warning.style.opacity = 0;
    cart.style.right = 0;
    if (window.innerWidth >= 800 && window.innerWidth <= 1000) {
      main.style.marginRight = "350px";
    } else if (window.innerWidth >= 800) {
      main.style.marginRight = "500px";
    }
  } else {
    cart.style.right = "-800px";
    main.style.marginRight = 0;
  }
}

function toggleCart() {
  cart.style.right == "0px" ? showCart(false) : showCart(true);
}

let email = sessionStorage.getItem("email");

document.addEventListener("DOMContentLoaded", () => {
  window.orderPlaced = false;
});

async function checkout() {
  const res = await fetch(
    `getCartItems?email=${encodeURIComponent(sessionStorage.getItem("email"))}`
  );
  const userCart = await res.json();
  if (userCart.length == 0) {
    warning.style.opacity = 1;
    window.orderPlaced = false;
    window.dispatchEvent(new Event("update"));
    return;
  }

  if (validateEmail()) {
    warning.style.opacity = 0;

    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.innerHTML = "Checking out ...";
    checkoutBtn.style.fontSize = "50px";
    createEmail();
    checkoutBtn.innerHTML = "Check out";
    checkoutBtn.style.fontSize = "60px";
  } else {
    window.openAccountModal();
  }
}

function validateEmail() {
  email = sessionStorage.getItem("email");
  return (
    email &&
    email.trim() !== "" &&
    email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
}

async function createEmail() {
  const date = new Date();
  const res = await fetch(
    `getCartItems?email=${encodeURIComponent(sessionStorage.getItem("email"))}`
  );
  const userCart = await res.json();
  let orderTotal = 0;
  userCart.forEach((item) => {
    orderTotal += item.price * item.quantity.toFixed(2);
  });
  await fetch("saveOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      cart: userCart,
      orderTotal: orderTotal,
    }),
  });
  window.orderPlaced = true;
  window.dispatchEvent(new Event("update"));

  const orderItems = userCart
    .map(
      (item) => `
      <tr style="vertical-align: top; height: 61px;">
        <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content;">
          <img style="height: 100px;" src=${
            item.imagepath
          } alt="item" height="100px">
        </td>
        <td style="padding: 24px 8px 0 8px; width: 100%;">
          <div>${item.name}</div>
          <div>Unit price : $ ${item.price.toFixed(2)}</div>
          <div style="font-size: 14px; color: #888; padding-top: 4px;">&nbsp;</div>
        </td>
        <td style="padding: 24px 40px 0 0; white-space: nowrap;">Qty : ${
          item.quantity
        }</td>
        <td style="padding: 24px 4px 0 0; white-space: nowrap;"><strong>$ ${(
          item.price * item.quantity
        ).toFixed(2)}</strong></td>
      </tr>
    `
    )
    .join("");

  emailjs
    .send(
      "service_eqflx1d",
      "template_u9siuy8",
      {
        email: email,
        orderItems: orderItems,
        total: parseFloat(orderTotal).toFixed(2),
        time: date.toLocaleString(),
      },
      "LyjyTLGN4DHGtdTq1"
    )

    .then((response) => {
      console.log("Email sent successfully!", response);
    })

    .catch((error) => {
      console.error("Error sending email:", error);
    });

  await fetch(`deleteItem?email=${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
  window.dispatchEvent(new Event("update"));
}
