<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data() {
    return {
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
        responsive: true,
        maintainAspectRatio: false
      },
      chartData: {
        labels: ['Push Up', 'Sit Up', 'Jumping Jack', 'High Knee', 'Squat'],
        datasets: [{
          label: 'Total Count',
          borderWidth: 1,
          pointBorderColor: '#2554FF',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          data: []
        }]
      }
    }
  },
  mounted() {
    this.$axios.post('/api/data/exercise/get', { userId: this.$auth.user.id }).then((data) => {
      console.log(data)
      this.chartData.datasets[0].data = data.data
      this.renderChart(this.chartData, this.options)
    })

  }
}
</script>
