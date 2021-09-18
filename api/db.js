const { Pool } = require('pg')

const pool = new Pool({
  user: 'love',
  host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
  database: 'indoor-trainer-3524.defaultdb',
  port: 26257,
  password:"lyqPpLFVaVflW1Mj",
  ssl: true
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
