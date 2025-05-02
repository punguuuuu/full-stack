class Orders extends React.Component {
    constructor (props) { 
        super(props);
        this.state = {
            email: "",
            orders: [],
        }
    }

    async loadOrderHistory() {
        const userOrders = await window.getOrderHistory(this.state.email);
        const individualOrders = [];
    
        for (const order of userOrders) {
            const allOrderDetails = await window.getOrders(order.orderid);
            individualOrders.push(...allOrderDetails);
        }
    
        this.setState({ orders: individualOrders });
    }
    

    init() {
        this.setState({
            email: sessionStorage.getItem("email"),
        }, () => {
            this.loadOrderHistory();
            }
        );
    }

    componentDidMount() {
        this.init();
        
        window.addEventListener('updateUser', () => {
            this.init();
        });
    }

    render() {
        return (
            <>
                {this.state.orders.length === 0 ? (
                    <p>empty ...</p> 
                    ) : (
                        this.state.orders.map((item, index) => (
                            <div key={index}>
                                <img src={item.imagepath} alt={item.name}/>
                                <p>{item.orderid}</p>
                                <p>{item.orderdate}</p>
                                <p>{item.name}</p>
                                <p>{item.price}</p>
                                <p>{item.quantity}</p>
                                <p>{item.total}</p>
                            </div>
                        ))
                )}
            </>
        );
    }
}

ReactDOM.render(
    <React.StrictMode>
        <Orders/>
    </React.StrictMode>,
    document.getElementById("orderHistory")
);