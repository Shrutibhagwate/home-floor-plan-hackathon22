<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <the-header></the-header>
  <!-- <router-view v-slot="slotProps">
        <transition name="route" mode="out-in" >
            <component :is="slotProps.Component"></component>
        </transition>
  </router-view> -->
  <router-view></router-view>
  <div v-if="isLoading">
      <base-spinner></base-spinner>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'
// import Login from './views/Login.vue'

export default {
  name: 'App',
  components: {
    // Login,
    TheHeader
  },
  data() {
    return {
      isLoading: false
    }
  },
  async created() {
    this.isLoading = true;
    await this.$store.dispatch('tryLogin');
    this.isLoading = false;
  },
}
</script>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

    * {
    box-sizing: border-box;
    }

    html {
    font-family: "Roboto", sans-serif;
    }

    body {
    margin: 0;
    }

    .route-enter-from{
        opacity: 0;
        transform: translateY(-30px);
    }

    .route-leave-to{
        opacity: 0;
        transform: translateY(30px);
    }

    .route-enter-to{
        transition: all 0.3s ease-out;
    }

    .route-leave-from{
        transition: all 0.3s ease-in;
    }

    .route-enter-active{
        opacity: 1;
        transform: translateY(0);
    }

    .route-leave-active{
        opacity: 1;
        transform: translateY(0);
    }
</style>
