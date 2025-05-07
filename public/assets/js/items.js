function showDetails(items) {
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

class ShopItems extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="items-container">
        {this.props.items.map((items, index) => (
          <div className="item" key={index}>
            <img
              src={items.imagepath}
              alt={items.itemid}
              style={{ marginBottom: "-80px" }}
              onClick={() => showDetails(items)}
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

class SearchItems extends React.Component {
  constructor(props) {
    super(props);
    this.searchItemInput = React.createRef();
    this.state = {
      searchInput: "",
      searchResults: [],
      searching: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keypress', this.performSearch)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.performSearch)
  }

  performSearch = (event) => {
    if (event.key === 'Enter') {
      this.searchItem();
    }
  }

  searchItem = async () => {
    const input = this.searchItemInput.current.value.trim();

    if (input === "") {
      this.setState({ 
        searchResults: [],
        searching: true,
       });
      return;
    }

    const search = await window.getItems(input);

    this.setState({
      searchInput: input,
      searchResults: search,
      searching: true,
    });
  };

  resetSearch = async () => {
    this.searchItemInput.current.value = "";
    this.setState({ 
      searchResults: [],
      searching: false,
     });
  }

  render() {
    return (
      <>
        <input
          type="text"
          className="searchBar"
          placeholder="Look for your cravings here"
          ref={this.searchItemInput}
        />
        <div style={{display:"flex", width:"100%", justifyContent:"center", gap:"50px"}}>
          <a id="searchBtn" onClick={this.searchItem}>
            <i
              className="fa fa-search"
              style={{ fontSize: "30px"}}
            ></i>
          </a>
          <a id="refreshBtn" onClick={this.resetSearch}>
            <i
              className="fa fa-refresh"
              style={{ fontSize: "30px"}}
            ></i>
          </a>
        </div>

        <div className="items-container">
          {this.state.searchResults.length === 0 && this.state.searching ? (
            <p>Nothing found :(</p>
          ) : (
            this.state.searchResults.map((items, index) => (
              <div className="item" key={index}>
                <img
                  src={items.imagepath}
                  alt={items.itemid}
                  style={{ marginBottom: "-80px" }}
                  onClick={() => showDetails(items)}
                />
                <p>{items.name}</p>
              </div>
            ))
          )}
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <SearchItems />
  </React.StrictMode>,
  document.getElementById("searchResult")
);