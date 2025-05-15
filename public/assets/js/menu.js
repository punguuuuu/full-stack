class AccountModal extends React.Component {
  constructor(props){
    super(props);
    this.password = React.createRef();
    this.container = React.createRef();
    this.button = React.createRef();
    this.state = {
      emailError: "",
      passwordError: "",
      type: 'logIn',
    }
  }

  reset = () => {
    this.setState({
      emailError: '',
      passwordError:'',
    });
  }

  changeType = () => {
    this.reset();
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
    if (this.validateEmail()) {
      this.setState({emailError: ''});
      return(this.checkPassword());
    } else {
      this.setState({emailError: 'Invalid Email !'});
      return false;
    }
  }

  checkPassword = () => {
    if (this.password.current.value === ""){
      this.setState({ passwordError: 'Invalid password !'});
      return false;
    } else {
      this.setState({ passwordError: ''});
      return true;
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

  updateAuth(type) {
      const message = document.getElementById("authMessage");
      const auth = document.getElementById("auth");

      if (message){
        message.innerHTML = type + ' Successful'
        message.style.animation = "none";
        void message.offsetWidth;
        message.style.animation = "fadeOut 5s";
      }

      if (auth){
        document.getElementById("auth").innerHTML = 'Log Out';
      }
  }

  logIn = async () => {
    this.reset();

    if(this.checkDetails()) {
      this.button.current.textContent = 'Loging in ...';
      this.button.current.style.fontSize = '35px';
      const logInStatus = await window.logIn(document.querySelector(".lineEdit").value, this.password.current.value);
      this.button.current.textContent = 'Log In';
      this.button.current.style.fontSize = '50px';

      this.updateAuth('Log In');

      if(!logInStatus) {
        sessionStorage.setItem("email", document.querySelector(".lineEdit").value);
        window.dispatchEvent(new Event('updateUser'));
        window.dispatchEvent(new Event('update'));
        this.props.close();
      } else if(logInStatus === 'User not found !') {
        this.setState({ emailError: logInStatus});
      } else if(logInStatus === 'Incorrect password !') {
        this.setState({ passwordError: logInStatus});
      } else if(logInStatus === 'Email not confirmed !') {
        this.setState({ emailError: logInStatus});
      }
    }
  }

  signUp = async () => {
    this.reset();

    if(this.checkDetails()) {
      this.button.current.textContent = 'Signing up ...';
      this.button.current.style.fontSize = '35px';
      const signUpStatus = await window.signUp(document.querySelector(".lineEdit").value, this.password.current.value);
      this.button.current.textContent = 'Sign Up';
      this.button.current.style.fontSize = '50px';
      
      if(!signUpStatus) {
        sessionStorage.setItem("email", document.querySelector(".lineEdit").value);
        window.dispatchEvent(new Event('updateUser'));
        this.props.close();

        this.updateAuth('Sign Up');

      } else if(signUpStatus === 'User already exist !') {
        this.setState({ emailError: signUpStatus});
      } else if(signUpStatus === 'Password too short !') {
        this.setState({ passwordError: signUpStatus});
      }
    }
  }

  containerName = {
    width: "60%",
    color: "white",
    fontSize: "60px"
  }

  fieldName = {
    color: "white",
    fontSize: "40px",
  }

  fieldContainer = {
    display:"flex",
    justifyContent:"space-between",
    marginBottom:"-15px",
    alignItems:"center",
  }

  render() {
    if (!this.props.visible) return null;
  
    const isLogIn = this.state.type === "logIn";
    const title = isLogIn ? "Log In" : "Sign Up";
    const buttonText = isLogIn ? "Log In" : "Sign Up";
    const buttonHandler = isLogIn ? this.logIn : this.signUp;
    const toggleText = isLogIn ? "Sign Up" : "Log In";
  
    return (
      <div id="accountModal">
        <div id="accountContainer" ref={this.container}>
          <a
            href="#close"
            className="containerBtn"
            style={{ marginBottom: "40px" }}
            onClick={this.props.close}
          >X
          </a>
  
          <p style={this.containerName}>{title}</p>
  
          <div style={{ textAlign: "left", width: "80%" }}>
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Email</p>
              <p id="invalid">{this.state.emailError}</p>
            </div>
            <input
              type="text"
              className="lineEdit"
              defaultValue={sessionStorage.getItem("email") || ""}
            />
  
            <div style={this.fieldContainer}>
              <p style={this.fieldName}>Password</p>
              <p id="invalid">{this.state.passwordError}</p>
            </div>
            <input type="password" className="lineEdit" ref={this.password} />
          </div>
  
          <button id="confirmBtn" onClick={buttonHandler} ref={this.button}>
            {buttonText}
          </button>
  
          <a
            style={{ color: "white", fontSize: "30px", display: "block" }}
            onClick={this.changeType}
          >
            {toggleText}
          </a>
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