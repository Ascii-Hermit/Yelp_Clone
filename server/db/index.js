const { Pool } = require('pg')
const pool = new Pool(); //automatically looks for object parameters in environment variables
module.exports = {
    query: (text,params)=>pool.query(text,params),
}