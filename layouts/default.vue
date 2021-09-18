<template>
  <div>
    <Navbar />
    <div class='bg p-lg-5 p-4'>
      <Nuxt />
    </div>
  </div>
</template>

<style>
.bg {
  background: linear-gradient(rgba(255, 255, 255, .4), rgba(255, 255, 255, .4)), url("./assets/image/bg.jpg");
  background-size: cover;
  position: relative;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 90vh;
}
</style>
