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