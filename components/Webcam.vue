<template>
  <b-card id='videoCard' class='text-center mb-3'>
    <p v-if='currentPose!==null' class='title-text' :class='poseTextStyle'>{{ currentPose }}</p>
    <p v-else class='title-text text-info'>Choose an activity</p>
    <video
      ref='video'
      autoplay
      width='100%'
      height='100%'
      style='display: none'
    ></video>
    <canvas ref='canvas' :width='width' :height='height'></canvas>
  </b-card>
</template>

<script>
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'

export default {
  data() {
    return {
      ctx: null,
      width: null,
      height: null,
      canvas: null,
      // indicate the frequency of one act
      interval: 0,
      // stage will be 1 and 2, every loop cause one emit to table
      currentStage: null
    }
  },
  computed: {
    currentPose() {
      return this.$store.state.currentPose
    },
    poseTextStyle() {
      return this.$store.state.poseTextStyle
    },
    inputVideo() {
      return this.$refs.video
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d')
    try {
      this.init()
    } catch (e) {
    }

    // auto increment time counter
    setInterval(() => {
      this.interval++
    }, 1000)
  },
  methods: {
    init() {
      // activate webcam for pose estimation
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        }
      })
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })
      // loop onResult to estimate frame by frame
      pose.onResults(this.onResults)

      const camera = new Camera(this.inputVideo, {
        onFrame: async () => {
          await pose.send({
            image: this.inputVideo
          })
        }
      })
      camera.start()
    },
    onResults(results) {
      // resizing according to card container size
      const videoCard = document.getElementById('videoCard')
      const ratio = this.inputVideo.videoHeight / this.inputVideo.videoWidth
      // responsive canvas dimension
      if (this.inputVideo.videoWidth > videoCard.offsetWidth * 0.9) {
        this.width = videoCard.offsetWidth * 0.9
        this.height = videoCard.offsetWidth * 0.9 * ratio
      } else {
        this.width = results.image.width
        this.height = results.image.height
      }
      this.ctx.save()

      try {
        this.ctx.clearRect(
          0,
          0,
          this.$refs.canvas.width,
          this.$refs.canvas.height
        )

        // Only overwrite missing pixels.
        this.ctx.globalCompositeOperation = 'destination-atop'
        this.ctx.drawImage(
          results.image,
          0,
          0,
          this.$refs.canvas.width,
          this.$refs.canvas.height
        )

      } catch (e) {
      }

      this.ctx.globalCompositeOperation = 'source-over'

      if (results.poseLandmarks) {
        // cancel out face land mark
        for (let i = 0; i < 11; i++) {
          results.poseLandmarks[i].visibility = 0.01
        }
        try {
          if (this.poseTextStyle.includes('text-success')) {
            switch (this.currentPose) {
              case 'Push Up':
                this.pushUpCounter(results.poseLandmarks)
                break
              case 'Squat':
                this.squatCounter(results.poseLandmarks)
                break
              case 'Jumping Jack':
                this.jumpingJackCounter(results.poseLandmarks)
                break
              case 'Sit Up':
                this.sitUpCounter(results.poseLandmarks)
                break
              case 'High Knee':
                this.highKneeCounter(results.poseLandmarks)
                break
              default: {
                break
              }
            }
          }
        } catch (e) {

        }

      }

      drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#85929E',
        lineWidth: 5,
        visibilityMin: 0.65
      })
      drawLandmarks(this.ctx, results.poseLandmarks, {
        color: '#48C9B0',
        lineWidth: 5,
        visibilityMin: 0.65
      })

      this.ctx.restore()
    }
    ,
    addExerciseCount(name) {
      this.$emit('updateExerciseCount', [
        name,
        this.calculateFrequency(this.interval)
      ])
      // every time an count act done, reset interval/every second pass for time act, interval recount
      this.interval = 0
    }
    ,
    calculateFrequency(interval) {
      // More than 5 second idle
      // final calorie of a single act(count type exercise) = coefficient * base calorie
      // There is three level of coefficient, coefficient calculate based on interval, it affects calorie burnt and body muscle usage
      if (interval > 4) {
        return 1
      } else if (interval > 2) {
        return 1.3
      } else {
        return 1.6
      }
    }
    ,
    calculateAngle(a, b, c) {
      // find angle b
      let angle =
        Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
      angle = Math.abs((angle * 180.0) / Math.PI)
      return angle > 180 ? 360 - angle : angle
    }
    ,
    pushUpCounter(poses) {
      let a, b, c, d, e, f
      let upperBodyReady = false
      let lowerBodyReady = false
      // Check Upper body
      if (this.checkVisibility([poses[11], poses[13], poses[15]])) {
        // check whether these three joint on screen
        a = 11
        b = 13
        c = 15
        upperBodyReady = true
      } else if (this.checkVisibility([poses[12], poses[14], poses[16]])) {
        a = 12
        b = 14
        c = 16
        upperBodyReady = true
      }
      // Check lower body
      if (this.checkVisibility([poses[23], poses[25], poses[27]])) {
        // check whether these three joint on screen
        d = 23
        e = 25
        f = 27
        lowerBodyReady = true
      } else if (this.checkVisibility([poses[24], poses[26], poses[28]])) {
        d = 24
        e = 26
        f = 28
        lowerBodyReady = true
      }
      // the stage will only be calculated if at least one side of lower body and upper body in camera
      if (upperBodyReady && lowerBodyReady) {
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) > 160 &&
          this.calculateAngle(poses[d], poses[e], poses[f]) > 160
        ) {
          this.currentStage = 1
        }
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) < 110 &&
          this.calculateAngle(poses[d], poses[e], poses[f]) > 160
        ) {
          if (this.currentStage === 1) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 2
        }
      }
    }
    ,
    squatCounter(poses) {
      let a, b, c, d
      let canProcess = false
      const STAND = 160
      const SQUAT = 110
      if (this.checkVisibility([poses[11], poses[23], poses[25], poses[27]])) {
        a = 11
        b = 23
        c = 25
        d = 27
        canProcess = true
      } else if (
        this.checkVisibility([poses[12], poses[24], poses[26], poses[28]])
      ) {
        a = 12
        b = 24
        c = 26
        d = 28
        canProcess = true
      }
      if (canProcess) {
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) > STAND &&
          this.calculateAngle(poses[b], poses[c], poses[d]) > STAND
        ) {
          this.currentStage = 1
        }
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) < SQUAT &&
          this.calculateAngle(poses[b], poses[c], poses[d]) < SQUAT
        ) {
          if (this.currentStage === 1) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 2
        }
      }
    }
    ,
    jumpingJackCounter(poses) {
      let a, b, c, d, e, f
      let upperBodyReady = false
      let lowerBodyReady = false
      // Check Upper body
      if (this.checkVisibility([poses[11], poses[13], poses[23]])) {
        // check whether these three joint on screen
        a = 11
        b = 13
        c = 23
        upperBodyReady = true
      } else if (this.checkVisibility([poses[12], poses[14], poses[24]])) {
        a = 12
        b = 14
        c = 24
        upperBodyReady = true
      }
      // Check lower body
      if (this.checkVisibility([poses[24], poses[23], poses[27]])) {
        // check whether these three joint on screen
        d = 24
        e = 23
        f = 27
        lowerBodyReady = true
      } else if (this.checkVisibility([poses[23], poses[24], poses[28]])) {
        d = 23
        e = 24
        f = 28
        lowerBodyReady = true
      }
      // the stage will only be calculated if at least one side of lower body and upper body in camera
      if (upperBodyReady && lowerBodyReady) {
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) > 160 &&
          this.calculateAngle(poses[d], poses[e], poses[f]) > 120
        ) {
          this.currentStage = 1
        }
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) < 60 &&
          this.calculateAngle(poses[d], poses[e], poses[f]) < 100
        ) {
          if (this.currentStage === 1) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 2
        }
      }
    }
    ,
    highKneeCounter(poses) {
      let a, b, c, d, e, f, g, h
      const LIFT = 115
      const DOWN = 140
      let canProcess = false
      if (
        this.checkVisibility([
          poses[11],
          poses[23],
          poses[25],
          poses[27],
          poses[12],
          poses[24],
          poses[26],
          poses[28]
        ])
      ) {
        a = 11
        b = 23
        c = 25
        d = 27
        e = 12
        f = 24
        g = 26
        h = 28
        canProcess = true
      }
      if (canProcess) {
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) < LIFT &&
          this.calculateAngle(poses[b], poses[c], poses[d]) < LIFT &&
          this.calculateAngle(poses[e], poses[f], poses[g]) > DOWN &&
          this.calculateAngle(poses[f], poses[g], poses[h]) > DOWN
        ) {
          if (this.currentStage === 2) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 1
        }
        if (
          this.calculateAngle(poses[e], poses[f], poses[g]) < LIFT &&
          this.calculateAngle(poses[f], poses[g], poses[h]) < LIFT &&
          this.calculateAngle(poses[a], poses[b], poses[c]) > DOWN &&
          this.calculateAngle(poses[b], poses[c], poses[d]) > DOWN
        ) {
          if (this.currentStage === 1) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 2
        }
      }
    }
    ,
    sitUpCounter(poses) {
      let a, b, c, d
      let canProcess = false
      const LAY = 100
      const CRUNCH = 70
      const KNEE_BENT = 120
      if (this.checkVisibility([poses[11], poses[23], poses[25], poses[27]])) {
        a = 11
        b = 23
        c = 25
        d = 27
        canProcess = true
      } else if (
        this.checkVisibility([poses[12], poses[24], poses[26], poses[28]])
      ) {
        a = 12
        b = 24
        c = 26
        d = 28
        canProcess = true
      }
      if (canProcess) {
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) > LAY &&
          this.calculateAngle(poses[b], poses[c], poses[d]) < KNEE_BENT
        ) {
          this.currentStage = 1
        }
        if (
          this.calculateAngle(poses[a], poses[b], poses[c]) < CRUNCH &&
          this.calculateAngle(poses[b], poses[c], poses[d]) < KNEE_BENT
        ) {
          if (this.currentStage === 1) {
            // if it switch from previous stage, its count increase
            this.addExerciseCount(this.currentPose)
          }
          this.currentStage = 2
        }
      }
    }
    ,
    checkVisibility(...poses) {
      for (const posesKey in poses) {
        if (posesKey.visibility < 0.4) {
          return false
        }
      }
      return true
    }
  }
}
</script>
