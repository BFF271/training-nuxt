<template>
  <div v-if='login'>
    <b-container class='d-flex justify-content-center flex-column align-items-center index'>
      <p class='title-text font-weight-bold text-dark text-center' style='font-size:4rem'>No Pain, No Gain! Let's get
        started!</p>
      <div class='d-flex justify-content-center'>
        <div class='m-3'>
          <b-button variant='success' style='white-space:nowrap' href='/exercise'>Start my training</b-button>
        </div>
        <div class='m-3'>
          <b-button variant='primary' style='white-space:nowrap' href='/statistics'>My statistics</b-button>
        </div>
      </div>
    </b-container>
  </div>
  <b-container v-else class='d-flex justify-content-center flex-column align-items-center index'>
    <p class='title-text font-weight-bold text-dark text-center' style='font-size:4rem'>Work out in your own pace! Let's
      get
      started!</p>
    <div class='d-flex justify-content-center'>
      <div class='m-3'>
        <Modal redirect='SignIn' color='success' />
      </div>
      <div class='m-3'>
        <Modal redirect='SignUp' color='info' />
      </div>

    </div>
    <div class='m-3'>
      <b-button variant='secondary' style='white-space:nowrap' href='/exercise'>Train as Guest</b-button>
    </div>

  </b-container>
</template>

<script>
import Modal from '../components/Modal.vue'

export default {
  auth: false,
  components: {
    Modal
  },
  data() {
    return {
      login: this.$auth.loggedIn
    }
  }
}

</script>

<style scoped>
.index {
  min-height: 70vh;
}

</style>
