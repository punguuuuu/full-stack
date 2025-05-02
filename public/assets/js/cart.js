class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      orderPlaced: false,
    };
  }

  componentDidMount() {
    window.addEventListener("update", () => {
      const items = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
      this.updateCartTotal();
      this.setState({
        items: items,
        orderPlaced: window.orderPlaced,
      });
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

  removeItem = (index) => {
    window.cartItems.splice(index, 1);
    sessionStorage.setItem("cartItems", JSON.stringify(window.cartItems));
    window.dispatchEvent(new Event("update"));
  };

  changeQuantity = (index, change) => {
    this.setState(prevState => {
      const items = [...prevState.items];
      items[index].quantity += change;
      if (items[index].quantity < 1) items[index].quantity = 1;
      items[index].total = (items[index].price * items[index].quantity).toFixed(2);
      sessionStorage.setItem("cartItems", JSON.stringify(items));
      return { items };
    }, () => {
      this.updateCartTotal();
    });
  };

  updateCartTotal () {
    const items = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    document.getElementById("cartTotal").innerHTML = `Total " $ ${total.toFixed(2)}`;
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
              <img src={item.src} alt="Cart Item" />
              <div style={this.textContainerStyle}>
                <p className="cartItem">{item.desc}</p>
                <p className="itemPrice">$ {item.price.toFixed(2)} X {item.quantity} = $ {item.total}</p>
                <div style={{display:"flex", gap:"20px"}}>
                  <a className="remove" onClick={() => this.removeItem(index)}>
                    Remove
                  </a>
                  <a className="itemQuantity" onClick={() => this.changeQuantity(index, -1)}>-</a>
                  <p className="itemQuantity">{item.quantity}</p>
                  <a className="itemQuantity" onClick={() => this.changeQuantity(index, 1)}>+</a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

const cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
ReactDOM.render(<Cart items={cartItems} />, document.getElementById("cartInfo"));