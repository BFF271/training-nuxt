<template>
  <b-container fluid='xl'>
    <b-row class='d-flex justify-content-center'>
      <b-alert
        :show='notice.dismissCountDown'
        dismissible
        variant='info'
        @dismissed='notice.dismissCountDown = 0'
        @dismiss-count-down='countDownChanged'
      >
        <p v-if='login'>
          Hi! {{ $auth.user.username }}, you have started your exercise, your
          training data will be record in "My statistics".
        </p>

        <p v-else>
          You have started your exercise as guest, your training data will not
          be stored.
        </p>
        <b-progress
          variant='primary'
          :max='notice.dismissSecs'
          :value='notice.dismissCountDown'
          height='5px'
        >
        </b-progress>
      </b-alert>
    </b-row>
    <b-row class='d-flex justify-content-center'>
      <b-col xl='7' lg>
        <b-card v-if='login' class='mb-3'>
          <p>
            Your recommend daily calorie loss is
            <span class='text-info'>300 - 600</span> Kcal!
          </p>
          <b-progress
            :value='totalCalorie.toFixed(2)'
            max='600'
            height='3rem'
            :variant='calorieStatus[0]'
            show-progress
            animated
          >
            <b-progress-bar :value='totalCalorie'>
              <span
              ><strong
              >{{ totalCalorie.toFixed(2) }} KCal / 600 KCal ({{
                  calorieStatus[1]
                }})</strong
              ></span
              >
            </b-progress-bar>
          </b-progress
          >
        </b-card>
        <Webcam @updateExerciseCount='updateActivity' />
      </b-col>
      <b-col xl='5' class='pb-3' lg>
        <b-card
          class='text-center'
          style='height: 100%; min-height: 400px'
          no-body
        >
          <b-tabs card>
            <b-tab title='Fitness Counter' active>
              <b-button @click='storeData'>Save</b-button>
              <Table :table='table' current='Push Up' />
            </b-tab>
            <b-tab title='Muscle status'>
              <MuscleDiagram :muscles='musclesColor' />
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      totalCalorie: 0,
      login: this.$auth.loggedIn,
      trainStatus: [
        // Not Train(Grey)
        '#808080',
        // Well Train(Green)
        '#228B22',
        // Over Train(Yello)
        '#f0ad4e',
        // Harmful Train(Red)
        '#B22222'
      ],
      notice: {
        dismissSecs: 8,
        dismissCountDown: 0,
        showDismissibleAlert: false
      },
      table: {
        fields: [
          {
            key: 'Activity',
            sortable: false
          },
          {
            key: 'Count',
            sortable: true
          },
          {
            key: 'Calories',
            sortable: true
          }
        ],
        activities: [
          // muscle array contains the muscles that will be affect while doing the activity, the first element is the name of muscle and second is the coefficient(how much it will get affected)
          {
            Activity: 'Push Up',
            Count: 0,
            Calories: 0,
            base: 0.3,
            muscle: [['Pectorals', 1], ['Deltoids', 0.75], ['Biceps', 0.9], ['Abs', 0.5], ['Obliques', 0.3], ['Triceps', 0.85], ['Lats', 0.6], ['Forearms', 0.9], ['Trapezius', 0.8], ['Glutes', 0.5], ['Hamstrings', 0.45]]
          },
          {
            Activity: 'Squat',
            Count: 0,
            Calories: 0,
            base: 0.3,
            muscle: [['Abs', 0.7], ['Quads', 1], ['Calves', 0.95], ['Hamstrings', 1], ['Glutes', 0.85], ['Obliques', 0.7], ['Lats', 0.7]]
          },
          {
            Activity: 'Jumping Jack',
            Count: 0,
            Calories: 0,
            base: 0.2,
            muscle: [['Quads', 0.4], ['Calves', 0.4], ['Hamstrings', 0.4], ['Glutes', 0.4], ['Deltoids', 0.4]]
          },
          {
            Activity: 'High Knee',
            Count: 0,
            Calories: 0,
            base: 0.12,
            muscle: [['Quads', 0.8], ['Calves', 1], ['Hamstrings', 1], ['Glutes', 0.8]]
          },
          {
            Activity: 'Sit Up',
            Count: 0,
            Calories: 0,
            base: 0.3,
            muscle: [['Abs', 1], ['Obliques', 0.9], ['Lats', 0.7], ['Glutes', 0.8]]
          }
        ]
      },
      muscles: {
        Trapezius: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Lats: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Triceps: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Forearms: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Glutes: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Hamstrings: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Calves: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Deltoids: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Pectorals: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Obliques: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Abs: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Quads: {
          calorie: 0,
          style: {
            fill: null
          }
        },
        Biceps: {
          calorie: 0,
          style: {
            fill: null
          }
        }
      }
    }
  },
  computed: {
    musclesColor() {
      // every muscle will change state every 25 calorie lost on that part, calorie = coefficient * activity base calorie
      const muscles = this.muscles
      Object.values(muscles).forEach((val) => {
        let fill
        if (val.calorie < 5)
          fill = 0
        else if (val.calorie < 25)
          fill = 1
        else if (val.calorie < 50)
          fill = 2
        else
          fill = 3
        val.style.fill = this.trainStatus[fill]
      })
      return muscles
    },
    calorieStatus() {
      if (this.totalCalorie < 300) {
        return ['info', 'Warm Up']
      } else if (this.totalCalorie <= 600) {
        return ['success', 'Just Right']
      } else {
        return ['warning', 'Over trained']
      }
    }
  },
  mounted() {
    this.showAlert()
    if (this.$auth.loggedIn) {
      this.fetchUserData()
    }
  },
  methods: {
    fetchUserData() {
      // if user is logged in, try to fetch data from database
      this.$axios.post('/api/exercise/get', {
        userId: this.$auth.user.id
      }).then((res) => {
        if (res.data.exist) {
          // load data fetched in data model if there is any
          if (res.data.activities !== null) {
            this.table.activities = res.data.activities
            for (let i = 0; i < res.data.activities.length; i++) {
              this.totalCalorie += parseFloat(res.data.activities[i].Calories)
            }
          }
          this.muscles = res.data.muscles
        }
      })
    },
    countDownChanged(dismissCountDown) {
      this.notice.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.notice.dismissCountDown = this.notice.dismissSecs
    },
    updateActivity(activity) {
      const currentActivity = this.table.activities.find(element => element.Activity === activity[0])
      // if activity match, count increase
      currentActivity.Count++
      currentActivity.Calories = (parseFloat(currentActivity.base) * parseFloat(activity[1]) + parseFloat(currentActivity.Calories)).toFixed(2)
      this.totalCalorie += currentActivity.Calories
      const muscleAffected = currentActivity.muscle
      for (let j = 0; j < muscleAffected.length; j++) {
        // add the calorie for the muscle part to data.muscle.calorie
        this.muscles[muscleAffected[j][0]].calorie += muscleAffected[j][1] * currentActivity.base
      }
    },
    storeData() {
      // send data to database after training
      this.$axios.post('/api/exercise/upload', {
        userId: this.$auth.user.id,
        muscles: this.muscles,
        activities: this.table.activities
      }).then((response) => {
        this.$swal(response.data)
      })
    }
  }
}
</script>
