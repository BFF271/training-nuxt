<template>
  <div>
    <input id='user-input' name='user-input' type='text' placeholder='Enter your response...' />
    <button id='send' type='button'>Send</button>
  </div>
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
      // activate voice flow
      const API_KEY = 'VF.61459dd3076dfd001b7ffb59.w6C3plIioGk824alpKwrJFySABAWn9oKKWYaReyW7M'
      const VERSION_ID = '61458f8bd91e7f000678fb76'
      const username = this.$auth.loggedIn ? this.$auth.user.username : 'Guest'

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
                if (message) {
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

      document.getElementById('send').addEventListener('click', handleCommand)
    }
  }
}
</script>
