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
      const items = await window.getCartItems(sessionStorage.getItem('email'));
      this.setState({
        items: items,
        orderPlaced: window.orderPlaced,
      });
      this.updateCartTotal();

      const checkoutBtn = document.getElementById('checkoutBtn');
      checkoutBtn.innerHTML = 'Checkout';
      checkoutBtn.style.fontSize = '60px';
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
    await window.deleteItem(itemid, sessionStorage.getItem('email'));
    window.dispatchEvent(new Event("update"));
  };

  changeQuantity = (index, change) => {
    this.setState(prevState => {
      const items = [...prevState.items];
      items[index].quantity += change;
      if (items[index].quantity < 1) items[index].quantity = 1;
      items[index].total = (items[index].price * items[index].quantity).toFixed(2);

      window.updateQuantity(items[index].quantity, items[index].itemid, sessionStorage.getItem('email'));

      return { items };
    }, () => {
      this.updateCartTotal();
    });
  };

  updateCartTotal (items) {
    let total = 0;
    this.state.items.forEach(item => {
      total += item.price * item.quantity;
    });
    document.getElementById("cartTotal").innerHTML = `Total : $ ${total.toFixed(2)}`;
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
              <img src={item.imagepath} alt="Cart Item" onClick={() => showItemDetails(item)} style={{cursor:"url(/assets/cursors/15-Link-Select.cur), pointer"}}/>
              <div style={this.textContainerStyle}>
                <p className="cartItem">{item.name}</p>
                <p className="itemPrice">$ {item.price.toFixed(2)} X {item.quantity} = $ {(item.price * item.quantity).toFixed(2)}</p>
                <div style={{display:"flex", gap:"20px"}}>
                  <a className="remove" onClick={() => this.removeItem(item.itemid)}>
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

async function renderCart() {
  const cartItems = await window.getCartItems(sessionStorage.getItem('email'));
  ReactDOM.render(<Cart items={cartItems} />, document.getElementById("cartInfo"));
}

renderCart();