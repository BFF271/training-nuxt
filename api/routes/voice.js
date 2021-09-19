const textToSpeech = require('@google-cloud/text-to-speech')
const { Router } = require('express')

const router = Router()

router.get('/speech/get', (req, res) => {
  // Creates a client
  const client = new textToSpeech.TextToSpeechClient()

  // The text to synthesize
  async function quickStart() {
    // The text to synthesize

    // Construct the request
    const request = {
      input: { text: req.query.text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: 'en-US' },
      // select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3' }
    }

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request)
    // Write the binary audio content to a local file
    console.log(response.audioContent.toString('base64'))
    res.send(response.audioContent.toString('base64'))
  }

  quickStart()
})

module.exports = router
