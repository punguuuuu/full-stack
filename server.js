const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 80;

const supabaseUrl = "https://ikcjdcmqkrfxixdlkrmh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrY2pkY21xa3JmeGl4ZGxrcm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDE3MzEsImV4cCI6MjA2MTM3NzczMX0.7flXo90-Ezb1x7_Nxviiy-g09Ql8mysZ_LSH584XW-w";
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/items", async (req, res) => {
  const name = req.query.name?.trim() ?? "";
  if (!name) return res.json([]);

  const { data, error } = await supabase.rpc("execute_sql", {
    query: `SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%${name}%')`,
  });

  if (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.get("/categories", async (req, res) => {
  const { data, error } = await supabase.rpc("execute_sql", {
    query: `SELECT * FROM items WHERE category= '${req.query.category}'`,
  });

  if (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.get("/getCartItems", async (req, res) => {
  const userID = await searchUser(req.query.email);
  const { data, error } = await supabase.rpc("get_cart_items", {
    uid: userID,
  });

  if (error) {
    console.error("Failed to fetch cart:", error.message);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.get("/getOrderHistory", async (req, res) => {
  const userID = await searchUser(req.query.email);
  if (!userID) {
    return res.json([]);
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("userid", userID);

  if (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.get("/getOrders", async (req, res) => {
  const { data, error } = await supabase.rpc("get_order_details_by_id", {
    oid: req.query.orderID,
  });

  if (error) {
    console.error("Query failed:", error);
    return res.status(500).json({ error: "Database error" });
  }
  res.json(data);
});

app.get("/logIn", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  const userID = await searchUser(email);
  if (!userID) {
    return res.json({ success: false, message: "User not found !" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return res.json({ success: false, message: "Incorrect password !" });
    } else if (error.message.includes("Email not confirmed")) {
      return res.json({ success: false, message: "Email not confirmed !" });
    } else {
      console.error("Login error:", error);
      return res.json({ success: false, message: "An error occurred !" });
    }
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: data.user,
    session: data.session,
  });
});

app.post("/signUp", async (req, res) => {
  const { email, password } = req.body;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes("User already registered")) {
      return res.json({ success: false, message: "User already exists !" });
    } else if (signUpError.message.includes("Password should be at least")) {
      return res.json({ success: false, message: "Password too short !" });
    } else {
      console.error("Sign up error:", signUpError);
      return res.json({ success: false, message: "An error occurred !" });
    }
  }

  const userID = signUpData?.user?.id;

  if (!userID) {
    return res.json({ success: false, message: "No user ID returned !" });
  }

  const { error: insertError } = await supabase
    .from("users")
    .insert([{ userid: userID, email }]);

  if (insertError) {
    console.error("Insert to users table failed:", insertError);
    return res.json({ success: false, message: "Failed to insert user !" });
  }

  return res.json({
    success: true,
    message: "Sign up successful",
  });
});

app.post("/addItemToCart", async (req, res) => {
  const { item, email } = req.body;
  const userID = await searchUser(email);

  const { data, error } = await supabase.from("cart").insert([
    {
      userid: userID,
      itemid: item.id,
      quantity: item.quantity,
    },
  ]);

  if (error) {
    console.error("Query failed:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.delete("/deleteItem", async (req, res) => {
  const { itemid, email } = req.query;
  const userID = await searchUser(email);

  const matchParams = { userid: userID };
  if (itemid) {
    matchParams.itemid = itemid;
  }

  const { data, error } = await supabase
    .from("cart")
    .delete()
    .match(matchParams)
    .select();

  if (error) {
    console.error("Delete failed:", error);
    return res.status(500).json({ error: "Database error" });
  }

  console.log("Deleted:", data);
  res.json(data);
});

app.put("/updateQuantity", async (req, res) => {
  const { quantity, itemid, email } = req.body;
  const userID = await searchUser(email);

  const { data, error } = await supabase
    .from("cart")
    .update({ quantity: quantity })
    .match({ userid: userID, itemid: itemid });

  if (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

app.post("/saveOrder", async (req, res) => {
  const { email, cart, orderTotal } = req.body;
  const userID = await searchUser(email);
  const date = new Date().toISOString();

  const { data, error } = await supabase.rpc("insert_order", {
    user_id: userID,
    order_date: date,
    total: orderTotal,
  });

  if (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Database error" });
  } else {
    console.log("OrderID " + data[0].order_id + " saved");
    cart.forEach((item) => {
      saveOrderItems(data[0].order_id, item);
    });
  }

  res.json(data);
});

async function createUser(email) {
  const { data, error } = await supabase.from("users").insert([{ email }]);

  if (error) {
    console.error("Error inserting user:", error);
  } else {
    console.log("User added to database");
  }
}

async function searchUser(email) {
  if (!email || email.trim() === "") return null;

  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error("Error searching user:", error);
    return null;
  }

  if (data.length == 0) {
    return null;
  }

  return data[0].userid;
}

async function saveOrderItems(orderID, item) {
  const { data, error } = await supabase.rpc("insert_order_item", {
    orderid: orderID,
    itemid: item.itemid,
    quantity: item.quantity,
  });

  if (error) {
    console.error("Error executing query:", error);
  } else {
    console.log(
      `ordered item: (orderID: ${orderID}, itemID: ${item.id}, qty: ${item.quantity})`
    );
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
