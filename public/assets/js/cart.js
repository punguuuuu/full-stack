class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      orderPlaced: false,
    };
  }

  componentDidMount() {
    window.addEventListener("update", async () => {
      try {
        const res = await fetch(
          `/getCartItems?email=${encodeURIComponent(
            sessionStorage.getItem("email")
          )}`
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }

        this.setState({
          items: data,
          orderPlaced: window.orderPlaced,
        });

        this.updateCartTotal();
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    });
    this.updateCartTotal();
  }

  itemStyle = {
    display: "flex",
    height: "15vh",
    marginLeft: "20px",
    marginBottom: "30px",
    justifyContent: "center",
    direction: "ltr",
  };

  textContainerStyle = {
    display: "flex",
    width: "60%",
    gap: "10px",
    marginLeft: "20px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  async removeItem(itemid) {
    await fetch(
      `deleteItem?itemid=${encodeURIComponent(
        itemid
      )}&email=${encodeURIComponent(sessionStorage.getItem("email"))}`,
      { method: "DELETE" }
    );
    window.dispatchEvent(new Event("update"));
  }

  changeQuantity = (index, change) => {
    this.setState(
      (prevState) => {
        const items = [...prevState.items];
        items[index].quantity += change;
        if (items[index].quantity < 1) items[index].quantity = 1;
        items[index].total = (
          items[index].price * items[index].quantity
        ).toFixed(2);

        fetch("updateQuantity", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: items[index].quantity,
            itemid: items[index].itemid,
            email: sessionStorage.getItem("email"),
          }),
        });

        return { items };
      },
      () => {
        this.updateCartTotal();
      }
    );
  };

  updateCartTotal(items) {
    let total = 0;
    this.state.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    document.getElementById("cartTotal").innerHTML = `Total : $ ${total.toFixed(
      2
    )}`;
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        {this.state.items.length === 0 ? (
          this.state.orderPlaced ? (
            <p style={{ color: "green", direction: "ltr" }}>Order placed !</p>
          ) : (
            <p style={{ color: "white" }}>Cart is empty</p>
          )
        ) : (
          this.state.items.map((item, index) => (
            <div style={this.itemStyle} key={index}>
              <img
                src={item.imagepath}
                alt="Cart Item"
                onClick={() => showItemDetails(item)}
                style={{
                  cursor: "url(/assets/cursors/15-Link-Select.cur), pointer",
                }}
              />
              <div style={this.textContainerStyle}>
                <p className="cartItem">{item.name}</p>
                <p className="itemPrice">
                  $ {item.price.toFixed(2)} X {item.quantity} = ${" "}
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                <div style={{ display: "flex", gap: "20px" }}>
                  <a
                    className="remove"
                    onClick={() => this.removeItem(item.itemid)}
                  >
                    Remove
                  </a>
                  <a
                    className="itemQuantity"
                    onClick={() => this.changeQuantity(index, -1)}
                  >
                    -
                  </a>
                  <p className="itemQuantity">{item.quantity}</p>
                  <a
                    className="itemQuantity"
                    onClick={() => this.changeQuantity(index, 1)}
                  >
                    +
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

async function renderCart() {
  const res = await fetch(
    `getCartItems?email=${encodeURIComponent(sessionStorage.getItem("email"))}`
  );
  const cartItems = await res.json();
  ReactDOM.render(
    <Cart items={cartItems} />,
    document.getElementById("cartInfo")
  );
}

renderCart();
