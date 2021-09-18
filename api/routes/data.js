const { Router } = require('express')

const router = Router()
const db = require('../db')

router.post('/data/exercise/get', async (req, res) => {
  const { rows } = await db.query(
    'SELECT activities FROM exercise WHERE userid = $1',
    [req.body.userId]
  )
  // 'Push Up', 'Sit Up', 'Jumping Jack', 'High Knee', 'Squat'
  let returnObj = [0, 0, 0, 0, 0]
  for (let i = 0; i < rows.length; i++) {
    returnObj[0] += rows[i].activities[0].Count
    returnObj[1] += rows[i].activities[4].Count
    returnObj[2] += rows[i].activities[2].Count
    returnObj[3] += rows[i].activities[3].Count
    returnObj[4] += rows[i].activities[1].Count
  }
  res.send(returnObj)
})

router.post('/data/calorie/get', async (req, res) => {
  const { rows } = await db.query(
    'SELECT activities FROM exercise WHERE userid = $1',
    [req.body.userId]
  )
  // 'Push Up', 'Sit Up', 'Jumping Jack', 'High Knee', 'Squat'
  let returnObj = [0, 0, 0, 0, 0]
  for (let i = 0; i < rows.length; i++) {
    returnObj[0] += rows[i].activities[0].Count
    returnObj[1] += rows[i].activities[4].Count
    returnObj[2] += rows[i].activities[2].Count
    returnObj[3] += rows[i].activities[3].Count
    returnObj[4] += rows[i].activities[1].Count
  }
  res.send(returnObj)
})

module.exports = router
