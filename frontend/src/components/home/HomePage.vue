<template>
    <img alt="Vue logo" src="../../assets/house2.jpeg">
    <h1 class="main-title">Get your dream home designed</h1>
    <div class="book-button">
        <base-button @click="proceed">BOOK DESIGN CONSULTATION</base-button>
    </div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false
        }
    },
    methods: {
        async proceed() {
            if (this.$store.getters.isAuthenticated) {
                this.$router.push('request-form');
            } else {
                this.isLoading = true;
                await this.$store.dispatch('login', {redirectTo: 'request-form'});
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
img {
    width: 100%;
}
.main-title {
    text-align: center;
}
.book-button {
    text-align: center;
}
</style>