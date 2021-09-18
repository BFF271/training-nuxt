<template>
  <div>
    <b-form v-if='show' @submit='onSubmit' @reset='onReset'>
      <b-form-group id='input-group-1' label='Username:' label-for='input-1'>
        <b-form-input
          id='input-1'
          v-model='form.username'
          type='text'
          placeholder='Enter Username'
          required
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id='input-group-5' label='Password:' label-for='input-5'>
        <b-form-input
          id='input-5'
          v-model='form.password'
          type='password'
          placeholder='Enter Password'
          required
        >
        </b-form-input>
      </b-form-group>

      <b-form-group
        id='input-group-6'
        label='Confirm Password:'
        label-for='input-6'
      >
        <b-form-input
          id='input-6'
          v-model='form.cpassword'
          type='password'
          placeholder='Confirm Your Password'
          required
        >
        </b-form-input>
      </b-form-group>

      <div class='d-flex justify-content-center'>
        <b-button type='submit' variant='success' class='mr-2'>Submit</b-button>
        <b-button type='reset' variant='danger' class='mr-2'>Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  sameAs,
  maxLength
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        username: '',
        password: '',
        cpassword: ''
      },
      show: true
    }
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      cpassword: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$swal(
          'There is error in your registration form!' +
          '\nRules:\n' +
          'Username/Password length: 6 - 20'
        )
      } else {
        this.$axios.post('/api/user/register', {
          username: this.form.username,
          password: this.form.password
        }).then((res) => {
          this.$swal(res.data)
        })
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.username = ''
      this.form.password = ''
      this.form.cpassword = ''

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
