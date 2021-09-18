<template>
  <div>
    <b-button :variant='color' @click='show=true'>{{ titles[redirect] }}</b-button>

    <b-modal v-if='!$auth.loggedIn' v-model='show' centered :title='titles[redirect]'
             :header-bg-variant='headerBgVariant'
             :header-text-variant='headerTextVariant' hide-footer xl='4' lg='6' md='8'>
      <SignIn v-if="redirect==='SignIn'" />
      <SignUp v-if="redirect==='SignUp'" />
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    redirect: {
      type: String,
      default: () => 'SignIn'
    },
    color: {
      type: String,
      default: () => 'primary'
    }
  },
  data() {
    return {
      show: false,
      headerBgVariant: 'secondary',
      headerTextVariant: 'light',
      titles: {
        'SignIn': 'Sign In',
        'SignUp': 'Sign Up'
      }
    }
  }
}

</script>
