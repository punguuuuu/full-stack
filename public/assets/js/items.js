class ShopItems extends React.Component {
  constructor(props) {
    super(props);
  }

  showDetails = (items) => {
    document.getElementById("detail").style.right = 0;
    document.getElementById("image").src = items.imagepath;
    document.getElementById("image").alt = items.itemid;
    document.getElementById("caption").innerHTML = items.name;
    document.getElementById("price").innerHTML = `$ ${items.price.toFixed(2)}`;
    document.getElementById("quantityValue").innerHTML = 1;
    document.getElementById("message").style.opacity = 0;
    document.getElementById("cart").style.right = "-800px";
    if (window.innerWidth >= 800 && window.innerWidth <= 1000) {
      document.getElementById("main").style.marginRight = "350px";
    } else if (window.innerWidth >= 800) {
      document.getElementById("main").style.marginRight = "500px";
    }
  };

  render() {
    return (
      <div className="items-container">
        {this.props.items.map((items, index) => (
          <div className="item" key={index}>
            <img
              src={items.imagepath}
              alt={items.itemid}
              style={{ marginBottom: "-80px" }}
              onClick={() => this.showDetails(items)}
            />
            <p>{items.name}</p>
          </div>
        ))}
      </div>
    );
  }
}

(async () => {
  const bread = await window.getCategory('bread');
  ReactDOM.render(
    <React.StrictMode>
      <ShopItems items={bread} />
    </React.StrictMode>,
    document.getElementById("bread-items")
  );

  const snacks = await window.getCategory('snacks');
  ReactDOM.render(
    <React.StrictMode>
      <ShopItems items={snacks} />
    </React.StrictMode>,
    document.getElementById("snack-items")
  );

  const desert = await window.getCategory('desert');
  ReactDOM.render(
    <React.StrictMode>
      <ShopItems items={desert} />
    </React.StrictMode>,
    document.getElementById("desert-items")
  );
})();