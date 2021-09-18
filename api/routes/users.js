const { createHash, randomUUID } = require('crypto')
const jwt = require('jsonwebtoken')
const { Router } = require('express')

const router = Router()
const db = require('../db')

let loadedUser

router.get('/users/get', async (req, res) => {
  const row = await db.query('SELECT * FROM "user"')
  res.send(row)
})

router.get('/user/get', (req, res) => {
  res.status(200).json({
    user: loadedUser,
  })
})

router.post('/user/login', async (req, res) => {
  try {
    const password = createHash('sha256')
      .update(req.body.password)
      .digest('hex')
    const result = await db.query(
      `SELECT * FROM "user" WHERE username = $1 AND password = $2`,
      [req.body.username, password]
    )
    if (result.rowCount > 0) {
      loadedUser = result.rows[0]
      const token = jwt.sign({ id: loadedUser.id }, 'trainer', {
        expiresIn: '7d',
      })
      res.status(200).json({ token })
      res.send()
    } else {
      res.status(204)
      res.send()
    }
  } catch (err) {
    res.status(500)
    res.send()
  }
})

router.post('/user/register', async (req, res) => {
  try {
    const password = createHash('sha256')
      .update(req.body.password)
      .digest('hex')
    const id = randomUUID()
    const { rowCount } = await db.query(
      'INSERT INTO "user"(id, username, password) VALUES($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *;',
      [id, req.body.username, password]
    )
    if (rowCount !== 0) {
      res.send('You have successfully registered!')
    } else if (rowCount === 0) {
      res.send('This username already exists!')
    } else {
      res.send('Error occurred! Please try again later.')
    }
  } catch (err) {
    res.send('Error occurred!')
  }
})

module.exports = router
