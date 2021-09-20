const { Router } = require('express')

const router = Router()
const db = require('../db')

router.get('/body/get', async (req, res) => {
  // see if there is exercise in recent 2 days as muscle need time to recover
  let day = new Date()
  day.setDate(day.getDate() - 3)
  const bodyStatus = await db.query(
    'SELECT "date", muscles FROM exercise WHERE userid = $1 AND "date" >= $2',
    [req.query.userId, day]
  )
  if (bodyStatus.rowCount === 0) {
    // if no recent body status
    res.send(null)
  } else {
    // else return latest recent status
    const today = new Date()
    const trainStatus = [
      // Not Train(Grey)
      '#808080',
      // Well Train(Green)
      '#228B22',
      // Over Train(Yello)
      '#f0ad4e',
      // Harmful Train(Red)
      '#B22222'
    ]
    let status = bodyStatus.rows[bodyStatus.rowCount - 1]
    const dayPass = today.getDate() - status.date.getDate()
    if (dayPass !== 0) {
      // if last training is yesterday, all muscle status lower 1 level, color shift, etc.
      Object.keys(status.muscles).forEach((key) => {
        // transform color code to level
        const level = trainStatus.indexOf(status.muscles[key].style.fill)
        // lower level and replace
        delete status.muscles[key].calorie
        status.muscles[key].style.fill =
          level - dayPass < 0 ? 0 : level - dayPass
      })
    } else {
      // if today
      Object.keys(status.muscles).forEach((key) => {
        // transform color code to level
        const level = trainStatus.indexOf(status.muscles[key].style.fill)
        // lower level and replace
        delete status.muscles[key].calorie
        status.muscles[key].style.fill = level
      })
    }
    // check how long has passed from last train as muscle recover, three day will be enough for all muscle to recover
    res.send(bodyStatus.rows[bodyStatus.rowCount - 1].muscles)
  }
})

router.post('/exercise/get', async (req, res) => {
  let returnObj = {
    exist: false,
    muscles: null,
    activities: null
  }
  // see if there is any activity today
  const result = await db.query(
    'SELECT activities, muscles FROM exercise WHERE userid = $1 AND "date" = $2',
    [req.body.userId, new Date()]
  )
  if (result.rowCount !== 0) {
    returnObj.muscles = result.rows[0].muscles
    returnObj.activities = result.rows[0].activities
    returnObj.exist = true
    res.send(returnObj)
  } else {
    // see if there is exercise in recent 2 days as muscle need time to recover
    let day = new Date()
    day.setDate(day.getDate() - 3)
    const exerciseRecord = await db.query(
      'SELECT "date", muscles FROM exercise WHERE userid = $1 AND "date" >= $2',
      [req.body.userId, day]
    )
    if (exerciseRecord.rowCount !== 0) {
      const trainStatus = [
        // Not Train(Grey)
        '#808080',
        // Well Train(Green)
        '#228B22',
        // Over Train(Yello)
        '#f0ad4e',
        // Harmful Train(Red)
        '#B22222'
      ]
      const today = new Date()
      const dayPass =
        today.getDate() -
        exerciseRecord.rows[exerciseRecord.rowCount - 1].date.getDate()
      // Put the last muscle record with muscle relief(same as body/get process)
      let temp = exerciseRecord.rows[exerciseRecord.rowCount - 1].muscles
      Object.keys(temp).forEach((key) => {
        // transform color code to level
        const level = trainStatus.indexOf(temp[key].style.fill)
        // lower level and replace
        if (level === 3) {
          temp[key].calorie = 25
        } else if (level === 2) {
          temp[key].calorie = 5
        } else if (level === 1) {
          temp[key].calorie = 0
        }
        temp[key].style.fill = level - dayPass < 0 ? 0 : level - dayPass
      })
      returnObj.muscles = temp
      returnObj.exist = true
      res.send(returnObj)
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
        new Date()
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
        new Date()
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
