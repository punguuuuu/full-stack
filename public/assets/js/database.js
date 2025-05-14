import { supabase } from "../../supabase.js";

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
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('userid', userID);

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
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    if (error.message.includes("Invalid login credentials")) {
      return "Incorrect password !";
    } else if (error.message.includes("Email not confirmed")) {
      return "Email not confirmed !";
    } else {
      console.error("Login error:", error);
      return "An error occurred !";
    }
  }
  return null;
}
window.logIn = logIn;

async function signUp(email, password) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) {
    if (signUpError.message.includes("User already registered")) {
      return "User already exist !";
    } else if (signUpError.message.includes("Password should be at least")) {
      return "Password too short !";
    } else {
      return "An error occurred";
    }
  }

  const userID = signUpData?.user?.id;

  if (!userID) {
    return "No user ID returned";
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ userid: userID, email: email }]);

  if (error) {
    console.error('Insert to users table failed:', error);
    return "Failed to insert user !";
  }

  return null;
}
window.signUp = signUp;