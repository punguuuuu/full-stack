import { supabase } from "../../../supabase.js";

function escapeSqlString(str) {
    return str.replace(/'/g, "''");
}

async function getItems(name) {
    const sqlName = escapeSqlString(name);
    if(name === "") {
      return;
    }

    const { data, error} = await supabase.rpc('execute_sql',{
      query : `SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%${sqlName}%')`
    });
    
    if (error) {
      console.error('Error executing query:', error);
    } else {
      return data;
    }
}
window.getItems = getItems;

async function getCategory(category) {
    const sqlCategory = escapeSqlString(category);
    const { data, error} = await supabase.rpc('execute_sql',{
        query : `SELECT * FROM items WHERE category= '${sqlCategory}'`
    });
    
    if (error) {
        console.error('Error executing query:', error);
    } else {
        return data;
    }
}
window.getCategory = getCategory;

async function createUser(email) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email }]);
  
    if (error) {
      console.error('Error inserting user:', error);
    } else {
      console.log('User added to database');
    }
}
  
async function searchUser(email) {
    if (!email || email.trim() === "") return null;

    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
  
    if (error) {
      console.error('Error searching user:', error);
      return null;
    }

    if (data.length == 0) {
      return null;
    }
  
    return data[0].userid;
}  

async function saveOrderItems(orderID, item) {
  const { data, error } = await supabase.rpc('insert_order_item', {
    orderid: orderID,
    itemid: item.id,
    quantity: item.quantity
  });  

  if (error) {
    console.error('Error executing query:', error);
  } else {
    console.log(`ordered item: (orderID: ${orderID}, itemID: ${item.id}, qty: ${item.quantity})`);
  }
}

async function saveOrder(email, cart, orderTotal) {
    const userID = await searchUser(email);
    const date = new Date().toISOString();
  
    const { data, error } = await supabase.rpc('insert_order', {
      user_id: userID,
      order_date: date,
      total: orderTotal,
    });
  
    if (error) {
      console.error('Error executing query:', error);
    } else {
      console.log('OrderID ' + data[0].order_id + ' saved');
      cart.forEach(item => {
        saveOrderItems(data[0].order_id, item);
      });
      
      window.cartItems.length = 0;
      sessionStorage.setItem("cartItems", window.cartItems);
      window.orderPlaced = true;
      window.dispatchEvent(new Event("update"));
    }
}
window.saveOrder = saveOrder;

async function getOrderHistory(email) {
  const userID = await searchUser(email);

  if (!userID) {
    return null;
  }
  
  const { data, error} = await supabase.rpc('execute_sql',{
      query : `SELECT * FROM orders WHERE userId=${userID}`
  });

  if (error) {
    console.error('Error executing query:', error);
    return null;
  } else {
    return data;
  }
}
window.getOrderHistory = getOrderHistory;

async function getOrders(orderID) {
  const { data, error } = await supabase.rpc('get_order_details_by_id', {
    oid: orderID
  });
  
  if (error) {
    console.error('Query failed:', error);
  } else {
    return data;
  }
}
window.getOrders = getOrders;

async function logIn(email, password) {
  const userID = await searchUser(email);

  if (!userID) {
    return 'User not found !';
  }
  
  const { data, error} = await supabase.rpc('execute_sql',{
    query : `SELECT password FROM users WHERE userid=${userID}`
  });

  if (error) {
    console.error('Query failed:', error);
  } else {
    if (password === data[0].password){
      return null;
    }
    return 'Incorrect password !'
  }
}
window.logIn = logIn;

async function signUp(email, password) {
  const userID = await searchUser(email);

  if (userID) {
    return 'User alraedy exists !';
  }
  
  const { data, error } = await supabase
  .from('users')
  .insert([{ email, password }]);

  if (error) {
    console.error('Query failed:', error);
  } else {
    return null;
  }
}
window.signUp = signUp;