<template>
  <div>
    <b-form v-if='show' @submit='onSubmit' @reset='onReset'>
      <b-form-group id='input-group-1' label='Username:' label-for='input-1'>
        <b-form-input id='input-1' v-model='form.username' type='text' placeholder='Enter username' required>
        </b-form-input>
      </b-form-group>

      <b-form-group id='input-group-2' label='Password:' label-for='input-2'>
        <b-form-input id='input-2' v-model='form.password' placeholder='Enter password' type='password' required>
        </b-form-input>
      </b-form-group>
      <div class='d-flex justify-content-center'>
        <b-button type='submit' variant='success' class='mr-2'>Log In</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      show: true
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()

      const res = await this.$auth.loginWith('local', {
        data: {
          username: this.form.username,
          password: this.form.password
        }
      })

      if (res.status === 200) {
        location.reload()
      } else if (res.status === 204) {
        this.$swal('Invalid username/password!')
      } else {
        this.$swal('Error occurred!')
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.username = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}

</script>
