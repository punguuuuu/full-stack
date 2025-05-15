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
    price: parseFloat(itemPrice.innerHTML.replace('$ ', '')),
    quantity: Number(quantity.innerHTML),
    total: (parseFloat(itemPrice.innerHTML.replace('$ ', '')) 
    * Number(quantity.innerHTML)).toFixed(2),
    imagepath: itemImg.src,
    id: itemImg.alt,
  };
  
  if (validateEmail()) {
    addBtn.style.display = "none";
    const userCart = await getCartItems(sessionStorage.getItem('email'));
    const identicalItem = userCart.find(item => item.name === itemInfo.name);
    if(identicalItem) {
      identicalItem.quantity += Number(quantity.innerHTML);
      window.updateQuantity(identicalItem.quantity, identicalItem.itemid, sessionStorage.getItem('email'));
    } else {
      window.addItemToCart(itemInfo, sessionStorage.getItem('email'));
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
  const cart = await window.getCartItems(email);
  if (cart.length == 0) {
    warning.style.opacity = 1;
    window.orderPlaced = false;
    window.dispatchEvent(new Event("update"));
    return;
  }

  if (validateEmail()) {
    warning.style.opacity = 0;

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.innerHTML = 'Checking out ...';
    checkoutBtn.style.fontSize = '50px';
    createEmail();

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
  const userCart = await window.getCartItems(email);
  let orderTotal = 0;
  userCart.forEach(item => {
    orderTotal += item.price * item.quantity.toFixed(2);
  });
  await window.saveOrder(email, userCart, orderTotal);

  const orderItems = userCart
    .map(
      (item) => `
      <tr style="vertical-align: top; height: 61px;">
        <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content;">
          <img style="height: 100px;" src=${item.imagepath} alt="item" height="100px">
        </td>
        <td style="padding: 24px 8px 0 8px; width: 100%;">
          <div>${item.name}</div>
          <div>Unit price : $ ${item.price.toFixed(2)}</div>
          <div style="font-size: 14px; color: #888; padding-top: 4px;">&nbsp;</div>
        </td>
        <td style="padding: 24px 40px 0 0; white-space: nowrap;">Qty : ${item.quantity}</td>
        <td style="padding: 24px 4px 0 0; white-space: nowrap;"><strong>$ ${item.total}</strong></td>
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
    
  await window.deleteItem(email);
  window.dispatchEvent(new Event("update"));
}