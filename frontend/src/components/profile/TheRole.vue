<template>
    <base-card class="container">
        <h2 class="heading">Logging in as a</h2>
        <div class="options">
            <base-button class="option" @click="selectOption('customer')">Customer</base-button>
            <base-button class="option" @click="selectOption('architect')">Architect</base-button>
        </div>
    </base-card>
    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>
</template>

<script>
import BaseButton from '../ui/BaseButton.vue';
export default {
  components: { BaseButton },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false
    }
  },
  emits: ['close'],
  methods: {
    tryYes() {
        this.$emit('yes');
    },
    tryClose() {
      if (this.fixed) {
        return;
      }
      this.$emit('close');
    },
    async selectOption(option) {
        this.isLoading = true;
        await this.$store.dispatch('setRole', { role: option });
        this.isLoading = false;
        this.$router.push('/profile');
    }
  },
};
</script>

<style scoped>
.heading {
    text-align: center;
}
.container {
    margin-top: 10rem;
}
.options {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 3rem;
    margin-bottom: 1rem;
}
.option {
    cursor: pointer;
}
</style>