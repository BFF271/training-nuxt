<template>
  <div>
    <b-navbar toggleable='sm' type='dark' variant='secondary'>
      <b-navbar-brand to='/' class='title-text'>Indoor Trainer</b-navbar-brand>

      <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>

      <b-collapse id='nav-collapse' is-nav>
        <b-navbar-nav>
          <b-nav-item to='/exercise' style='font-size:1.5rem'>Exercise!</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if='login' class='ml-auto'>
          <b-nav-item right>
            <b-button variant='danger' style='white-space:nowrap' @click='logout'>Log out</b-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: this.$auth.loggedIn
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout().then(() => {
        if (location.pathname !== '/') {
          this.$router.push('/')
        }
        location.reload()
      })
    }
  }
}

</script>
