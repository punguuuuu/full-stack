class AccountModal extends React.Component {
  constructor(props){
    super(props);
    this.password = React.createRef();
    this.container = React.createRef();
    this.state = {
      validEmail: true,
      validPassword: true,
      type: 'logIn',
    }
  }

  changeType = () => {
    this.setState(
      prevState => ({
        type: prevState.type === 'logIn' ? 'signUp' : 'logIn'
      }),
      () => {
        const containerRef = this.container.current;
        if (containerRef) {
          containerRef.style.animation = "none";
          void containerRef.offsetWidth;
          containerRef.style.animation = "zoom 0.5s";
        }
      }
    );
  }

  checkDetails = () => {
    sessionStorage.setItem("email", document.querySelector(".lineEdit").value);
    if (this.validateEmail()) {
      this.setState({validEmail: true});
      this.checkPassword();
    } else {
      this.setState({validEmail: false});
    }
  }

  checkPassword = () => {
    if (this.password.current.value !== ""){
      this.props.close();
      this.setState({validPassword: true});
    } else {
      this.setState({validPassword: false});
    }
    window.dispatchEvent(new Event('updateUser'));
  }
  
  validateEmail = () => {
    return (
      document.querySelector(".lineEdit").value.trim() !== "" &&
      document.querySelector(".lineEdit").value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    );
  }

  fieldName = {
    color: "white",
    fontSize: "40px",
  }

  fieldContainer = {
    display:"flex",
    justifyContent:"space-between",
    marginBottom:"-15px",
    alignItems:"center"
  }

  render(){
    if(!this.props.visible) return null;

    if(this.state.type === "logIn") return (
      <div id="accountModal">
        <div id="accountContainer" ref={this.container}>
          <a href="#close" 
            className="containerBtn"
            style={{marginBottom: "40px"}}
            onClick={this.props.close}>X</a>

          <p style={{width: "60%", color: "white", fontSize: "60px"}}>Log In</p>

          <div style={{textAlign: "left", width:"80%"}}>
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Email</p>
              {this.state.validEmail ? <div></div> : <p id="invalid">User not found !</p>}
            </div>
            <input type="text" className="lineEdit" defaultValue={sessionStorage.getItem("email") || ""}/>
            
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Password</p>
              {this.state.validPassword ? <div></div> : <p id="invalid">Incorrect Password !</p>}
            </div>
            <input type="password" className="lineEdit" ref={this.password}/>
          </div>
          <button id="confirmBtn" onClick={this.checkDetails}>Log In</button>
          <a style={{color: "white", fontSize: "30px", display:"block"}} onClick={this.changeType}>Sign Up</a>
        </div>
      </div>
    );

    if(this.state.type === "signUp") return (
      <div id="accountModal">
        <div id="accountContainer" ref={this.container}>
          <a href="#close" 
            className="containerBtn"
            style={{marginBottom: "40px"}}
            onClick={this.props.close}>X</a>

          <p style={{width: "60%", color: "white", fontSize: "60px"}}>Sign Up</p>

          <div style={{textAlign: "left", width:"80%"}}>
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Email</p>
              {this.state.validEmail ? <div></div> : <p id="invalid">Invalid Email !</p>}
            </div>
            <input type="text" className="lineEdit" defaultValue={sessionStorage.getItem("email") || ""}/>
            
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Password</p>
              {this.state.validPassword ? <div></div> : <p id="invalid">Invalid Password !</p>}
            </div>
            <input type="password" className="lineEdit" ref={this.password}/>
          </div>
          <button id="confirmBtn" onClick={this.checkDetails}>Sign Up</button>
          <a style={{color: "white", fontSize: "30px", display:"block"}} onClick={this.changeType}>Log In</a>
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
                  <a href="#email" className="changeAccount" onClick={() => this.changePage('account.html')}>Account</a>
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
      showAccountModal: false
    }
  }

  showAccountModal = (show) => {
    this.setState({showAccountModal: show});
  }

  componentDidMount() {
    window.openAccountModal = () => {
      this.showAccountModal(true);
    }
  }

  render() {
    return(
      <>
        <MenuBar showAccountModal={() => this.showAccountModal(true)}/>
        <AccountModal visible={this.state.showAccountModal} close={() => this.showAccountModal(false)}/>
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