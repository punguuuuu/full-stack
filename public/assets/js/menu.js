class EmailModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      valid: true
    }
  }

  checkEmail = () => {
    sessionStorage.setItem("email", document.querySelector(".lineEdit").value);
    if (this.validateEmail()) {
      this.props.close();
      this.setState({valid: true});
    } else {
      this.setState({valid: false});
    }
  }
  
  validateEmail = () => {
    return (
      document.querySelector(".lineEdit").value.trim() !== "" &&
      document.querySelector(".lineEdit").value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    );
  }

  render(){
    if(!this.props.visible) return null;

    return (
      <div id="emailModal">
        <div id="emailContainer">
          <a href="#close" 
            className="containerBtn"
            style={{marginBottom: "40px"}}
            onClick={this.props.close}>X</a>

          <p style={{width: "60%", color: "white"}}>Please provide us your email</p>
          <input type="text" className="lineEdit" style={{width: "80%", fontSize: "40px"}} 
            defaultValue={sessionStorage.getItem("email") || ""}/>
          <button id="confirmBtn" onClick={this.checkEmail}>Confirm</button>
          {this.state.valid ? <div style={{padding:"23px"}}></div> : <p id="invalidEmail">Invalid Email !</p>}
        </div>
      </div>
    );
  }
}

class MenuBar extends React.Component {
    constructor(props){
        super(props);
        this.menuRef = React.createRef();
    }

    componentDidMount() {
      window.addEventListener("toggleMenu", ()=> {
        this.toggleMenu();
      });

      window.addEventListener("showMenu", ()=> {
        this.showMenu(true);
      });
    }

    changePage(page) {
        if (!window.location.pathname.includes(page)) {
          window.location.href = page;
        } else {
          this.showMenu(false);
        }
    }
      
    main = document.getElementById("main");
      
    showMenu(show) {
      if (show) {
          this.menuRef.current.style.left = "0px";
          if(window.innerWidth >= 1000){
            main.style.marginLeft = "300px";
          }
        } else {
          this.menuRef.current.style.left = "-800px";
          main.style.marginLeft = "0";
        }
      
        setTimeout(() => {
          window.scrollTo(0, window.scrollY);
        }, 0);
    }
      
    toggleMenu(){
      this.menuRef.current.style.left == "0px" ? this.showMenu(false) : this.showMenu(true);
    }

    render() {
      return (
        <>
          <ul ref={this.menuRef} className="menu" onMouseLeave={() => this.showMenu(false)}>
              <li>
                  <a href="#close" className="menuClose" onClick={() => this.showMenu(false)}>X</a>
              </li>
              <li><a href="#index" onClick={() => this.changePage('index.html')}>Home</a></li>
              <li><a href="#shop" onClick={() => this.changePage('shop.html')}>Shop</a></li>
              <li><a href="#gallery" onClick={() => this.changePage('gallery.html')}>Gallery</a></li>
              <li><a href="#game" onClick={() => this.changePage('game.html')}>Stacker</a></li>
              <li><a href="#art" onClick={() => this.changePage('art.html')}>Art?</a></li>
              <li>
                  <a href="#email" className="changeEmail" onClick={this.props.showEmailModal}>Change Email</a>
              </li>
          </ul>
        </>
      );
  }
}

class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showEmailModal: false
    }
  }

  showEmailModal = (show) => {
    this.setState({showEmailModal: show});
  }

  componentDidMount() {
    window.openEmailModal = () => {
      this.showEmailModal(true);
    }
  }

  render() {
    return(
      <>
        <MenuBar showEmailModal={() => this.showEmailModal(true)}/>
        <EmailModal visible={this.state.showEmailModal} close={() => this.showEmailModal(false)}/>
      </>
    );
  }
}

ReactDOM.render (
  <React.StrictMode>
    <Menu />
  </React.StrictMode>,
  document.getElementById("menu")
)