<template>
  <b-container>
    <b-row class='justify-content-center mb-4'>
      <b-col cols='6'>
        <b-form-input id='user-input' placeholder='Enter your response'></b-form-input>
      </b-col>
      <b-col cols='3'>
        <b-button id='send' variant='outline-primary'>Send</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>Your Response:</p>
        <b-form-textarea
          id='transcript'
          rows='3'
          max-rows='3'
          readonly
        ></b-form-textarea>
        <p class='mt-3'>Message</p>
        <b-form-textarea
          id='msg'
          rows='6'
          max-rows='6'
          disabled
        ></b-form-textarea>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      API_KEY: 'VF.61459dd3076dfd001b7ffb59.w6C3plIioGk824alpKwrJFySABAWn9oKKWYaReyW7M',
      VERSION_ID: '61458f8bd91e7f000678fb76',
      exerciseArray: ['Push Up', 'Squat', 'Jumping Jack', 'High Knee', 'Sit Up']
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    textToAudio(text) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    },
    init() {
      const texts = document.getElementById('transcript')
      const API_KEY = 'VF.61459dd3076dfd001b7ffb59.w6C3plIioGk824alpKwrJFySABAWn9oKKWYaReyW7M'
      const VERSION_ID = '61458f8bd91e7f000678fb76'
      const username = this.$auth.loggedIn ? this.$auth.user.username : 'Guest'

      // activate voice flow

      const interact = (request) =>
        // call the voiceflow api with the user's name & request, get back a response
        fetch(`https://general-runtime.voiceflow.com/state/${VERSION_ID}/user/${encodeURI(username)}/interact`, {
          method: 'POST',
          headers: { Authorization: API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ request })
        })
          .then((res) => res.json())
          .then((trace) => {
              try {
                const message = trace.find(element => element.type === 'speak').payload.message
                if (message) {
                  this.textToAudio(message)
                  document.getElementById('msg').innerText += message + '\n'
                  const jump = trace.find(element => element.type === 'path' && element.payload.path === 'jump')
                  if (jump) {
                    const lowerCase = message.toLowerCase()
                    for (let i = 0; i < this.exerciseArray.length; i++) {
                      if (lowerCase.includes(this.exerciseArray[i].toLowerCase())) {
                        // if there is message and the message contains the keyword to set your current pose, add the pose to global state
                        this.$store.commit('changePose', [this.exerciseArray[i], 'text-warning'])
                      }
                    }
                  }
                }
                if (message.toLowerCase().includes('The training has begun'.toLowerCase())) {
                  // if the user choose to start current pose, change style to success, meaning its selected
                  this.$store.commit('changeStyle', 'text-success')
                } else if (message.toLowerCase().includes('Please say one activity on the table to change your activity'.toLowerCase())) {
                  // if user want to change the pose, remove current pose
                  this.$store.commit('removePose')
                } else if (message.includes('has been stopped')) {
                  // if user stop the current pose activity
                  this.$store.commit('changeStyle', 'text-warning')
                }

              } catch (err) {
                if (trace.find(element => element.type === 'end')) {
                  // if user end the voice flow, submit the data if user is logged in
                  if (this.$auth.loggedIn) {
                    this.$emit('storeData', true)
                  }
                }
              }
            }
          )

      // Call an Interaction Method to advance the conversation based on `userInput`.
      interact({ type: 'launch' })

      async function handleCommand() {
        // Get the user's response to the VF App's dialogue
        const userInput = document.getElementById('user-input').value
        // clear the input field
        document.getElementById('user-input').value = ''
        // Call an Interaction Method to advance the conversation based on `userInput`.
        await interact({ type: 'text', payload: userInput })
      }

      async function speakCommand() {
        console.log(true)
        const text = document.getElementById('transcript').value
        switch (true) {
          case text.toLowerCase().includes('push up'):
            await interact({ type: 'text', payload: 'push up' })
            break
          case text.toLowerCase().includes('sit up'):
            await interact({ type: 'text', payload: 'sit up' })
            break
          case text.toLowerCase().includes('high knee'):
            await interact({ type: 'text', payload: 'high knee' })
            break
          case text.toLowerCase().includes('jumping jack'):
            await interact({ type: 'text', payload: 'jumping jack' })
            break
          case text.toLowerCase().includes('squat'):
            await interact({ type: 'text', payload: 'squat' })
            break
          case text.toLowerCase().includes('end'):
            await interact({ type: 'text', payload: 'end' })
            break
          case text.toLowerCase().includes('change'):
            await interact({ type: 'text', payload: 'change' })
            break
          case text.toLowerCase().includes('start'):
            await interact({ type: 'text', payload: 'start' })
            break
          default:
            await interact({ type: 'text', payload: 'Unidentified text' })
            break
        }
      }

      document.getElementById('send').addEventListener('click', handleCommand)

      // activate voice listener

      /* eslint-disable */
      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      const recognition = new SpeechRecognition()
      recognition.interimResults = false
      recognition.continuous = false
      recognition.lang = 'en-US'

      recognition.addEventListener('result', (e) => {
        const text = Array.from(e.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')

        texts.innerText += text
        speakCommand()
      })

      recognition.addEventListener('end', () => {
        recognition.start()
      })

      recognition.start()

    },
  }
}
</script>
