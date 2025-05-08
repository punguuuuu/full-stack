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

        if (!userOrders){
            this.setState({ orders: individualOrders });
            return;
        }
    
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
        const groupedOrders = this.state.orders.reduce((acc, item) => {
            if (!acc[item.orderid]) {
                acc[item.orderid] = {
                    orderdate: item.orderdate,
                    items: [],
                    total: 0,
                };
            }
        
            const itemTotal = item.price * item.quantity;
            acc[item.orderid].items.push({ ...item, total: itemTotal });
            acc[item.orderid].total += itemTotal;
        
            return acc;
        }, {});
        
        
        return (
            <>
                {Object.keys(groupedOrders).length === 0 ? (
                    <p>empty ...</p>
                ) : (
                    Object.entries(groupedOrders).map(([orderid, order]) => (
                        <div key={orderid} className="orderContainer">
                            <div className="orderInfo">
                                <p style={{marginBottom:"-40px"}}>Order ID : {orderid}</p>
                                <p>Order date : {order.orderdate.split("T")[0]}</p>
                            </div>
                            {order.items.map((item, index) => (
                                <div key={index} className="itemContainer">
                                    <img src={item.imagepath} alt={item.name} className="itemImage" />
                                    <div style={{ width: "100%"}}>
                                        <div className="infoContainer">
                                            <p>{item.name}</p>
                                            <p>Qty : {item.quantity}</p>
                                            <p>Total : $ <strong>{item.total.toFixed(2)}</strong></p>
                                        </div>
                                        <p className="unitPrice">Unit price : $ {item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="orderTotal">
                                <p>Order total: <strong>$ {order.total.toFixed(2)}</strong></p>
                            </div>
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