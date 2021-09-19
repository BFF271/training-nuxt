const { Router } = require('express')
const { gTTS } = require('gtts.js')

const router = Router()

router.post('/text/send', (req, res) => {
  // convert text to speech and play it at front end
  const text = req.body.text
  const speech = new gTTS(text)

  res.send(speech.save('voice'))
})

module.exports = router
