const { Router } = require('express')

const router = Router()
const db = require('../db')

router.post('/exercise/get', async (req, res) => {
  let returnObj = {
    exist: false,
    muscles: null,
    activities: null,
  }
  // see if there is any activity today
  const result = await db.query(
    'SELECT activities, muscles FROM exercise WHERE userid = $1 AND "date" = $2',
    [req.body.userId, new Date()]
  )
  if (result.rowCount !== 0) {
    returnObj.muscles = result.rows[0].muscles
    returnObj.activities = result.rows[0].activities
    returnObj.exist = false
    return returnObj
  } else {
    // see if there is exercise in recent 2 days as muscle need time to recover
    let day = new Date()
    day.setDate(day.getDate() - 2)
    const exerciseRecord = await db.query(
      'SELECT muscles FROM exercise WHERE userid = $1 AND "date" >= $2',
      [req.body.userId, day]
    )
    if (exerciseRecord.rowCount !== 0) {
      // Put the last muscle record
      returnObj.muscles =
        exerciseRecord.rows[exerciseRecord.rowCount - 1].muscles
      returnObj.exist = true
      return returnObj
    }
  }
})

router.post('/exercise/upload', async (req, res) => {
  // check if there is any exercise done today, if there is, overwrite it
  const result = await db.query(
    'SELECT * FROM exercise WHERE userid = $1 AND "date" = $2',
    [req.body.userId, new Date()]
  )
  if (result.rowCount > 0) {
    const { rowCount } = await db.query(
      'UPDATE exercise SET muscles = $1, activities = $2 WHERE userid = $3 AND "date" = $4',
      [
        JSON.stringify(req.body.muscles),
        JSON.stringify(req.body.activities),
        req.body.userId,
        new Date(),
      ]
    )
    if (rowCount > 0) {
      res.send('You have updated your training data!')
    } else {
      res.send('Error Occurred!')
    }
  } else {
    const { rowCount } = await db.query(
      'INSERT INTO exercise(userid, muscles, activities, "date") VALUES($1, $2, $3, $4) RETURNING *;',
      [
        req.body.userId,
        JSON.stringify(req.body.muscles),
        JSON.stringify(req.body.activities),
        new Date(),
      ]
    )
    if (rowCount > 0) {
      res.send('You have stored your training data!')
    } else {
      res.send('Error Occurred!')
    }
  }
})

module.exports = router
