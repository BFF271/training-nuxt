<template>
  <b-container fluid-xl>
    <b-card-group deck>
      <b-card class='text-center' title='Exercise Record'>
        <BarChart />
      </b-card>
      <b-card class='text-center' title='Calorie'>
        <LineChart />
      </b-card>
    </b-card-group>
    <b-card-group deck class='mt-3'>
      <b-card class='text-center' title='Current Body Status'>
        <MuscleDiagram :muscles='musclesColor' />
      </b-card>
      <b-card class='text-center' title="Today's recommend exercise">
        <b-list-group v-for='(exercise,key) in recommendation' :key='key'>
          <b-list-group-item>{{ exercise }}</b-list-group-item>
        </b-list-group>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
export default {
  auth: true,
  data: () => ({
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
    muscles: {
      Trapezius: {
        fill: 0
      },
      Lats: {
        fill: 0
      },
      Triceps: {
        fill: 0
      },
      Forearms: {
        fill: 0
      },
      Glutes: {
        fill: 0
      },
      Hamstrings: {
        fill: 0
      },
      Calves: {
        fill: 0
      },
      Deltoids: {
        fill: 0
      },
      Pectorals: {
        fill: 0
      },
      Obliques: {
        fill: 0
      },
      Abs: {
        fill: 0
      },
      Quads: {
        fill: 0
      },
      Biceps: {
        fill: 0
      }
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      legend: {
        display: true
      },
      responsive: false,
      maintainAspectRatio: false
    },
    recommendation: ['A', 'B', 'C']
  }),
  computed: {
    musclesColor() {
      const muscles = this.muscles
      Object.values(muscles).forEach(val => {
        const fill = val.fill
        val.fill = this.trainStatus[fill]
      })
      return muscles
    }
  }
}

</script>
