const { Pool } = require('pg')

const pool = new Pool({
  // your options in postgreSQL
  user: '',
  host: '',
  database: '',
  port: 26257,
  password: '',
  ssl: true
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}
