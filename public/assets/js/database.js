import { supabase } from "../../supabase.js";

function escapeSqlString(str) {
    return str.replace(/'/g, "''");
}

async function getItems() {
    const { data, error} = await supabase.rpc('execute_sql',{
        query : `SELECT * FROM items`
    });
    
    if (error) {
        console.error('Error executing query:', error);
    } else {
        data.forEach(item => {
            console.log(item.name);
        });
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
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
  
    if (error) {
      console.error('Error searching user:', error);
      return null;
    }
  
    if (data.length === 0) {
      await createUser(email);
  
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', email);
  
      if (result.error || result.data.length === 0) {
        console.error('User creation failed:', result.error);
        return null;
      }
  
      return result.data[0].userid;
    }
  
    return data[0].userid;
}  

async function saveOrder(email) {
    const userID = await searchUser(email);
    const date = new Date().toISOString();
  
    const { data, error } = await supabase.rpc('insert_order', {
      user_id: userID,
      order_date: date
    });
  
    if (error) {
      console.error('Error executing query:', error);
    } else {
      return data[0].order_id;
    }
}
  
window.saveOrder = saveOrder;