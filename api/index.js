const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const users = require('./routes/users')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(users)

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
