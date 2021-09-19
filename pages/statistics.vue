<template>
  <b-container fluid-lg>
    <b-card-group deck>
      <b-card class='text-center text-info' title='Exercise Record'>
        <BarChart />
      </b-card>
    </b-card-group>
    <b-card-group deck class='mt-3'>
      <b-card class='text-center text-info' title='Current Body Status'>
        <MuscleDiagram :muscles='musclesColor' />
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
        style: {
          fill: 0
        }
      },
      Lats: {
        style: {
          fill: 0
        }
      },
      Triceps: {
        style: {
          fill: 0
        }
      },
      Forearms: {
        style: {
          fill: 0
        }
      },
      Glutes: {
        style: {
          fill: 0
        }
      },
      Hamstrings: {
        style: {
          fill: 0
        }
      },
      Calves: {
        style: {
          fill: 0
        }
      },
      Deltoids: {
        style: {
          fill: 0
        }
      },
      Pectorals: {
        style: {
          fill: 0
        }
      },
      Obliques: {
        style: {
          fill: 0
        }
      },
      Abs: {
        style: {
          fill: 0
        }
      },
      Quads: {
        style: {
          fill: 0
        }
      },
      Biceps: {
        style: {
          fill: 0
        }
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
    }
  }),
  computed: {
    musclesColor() {
      const muscles = this.muscles
      Object.values(muscles).forEach(val => {
        const fill = val.style.fill
        val.style.fill = this.trainStatus[fill]
      })
      return muscles
    }
  }, mounted() {
    this.getMuscle()
  },
  methods: {
    getMuscle() {
      this.$axios
        .get('/api/body/get', {
          params: {
            userId: this.$auth.user.id
          }
        }).then((res) => {
        console.log(res)
        if (res.data !== null) {
          this.muscles = res.data
        }
      })
    }
  }
}

</script>
