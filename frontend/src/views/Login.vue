<template>
  <div>
    <button @click="googleSignIn" v-if="!$store.getters.isAuthenticated">
      Sign In with Google
    </button>
    <button @click="googleSignOut" v-else>
      Sign Out
    </button>
  </div>
</template>

<script>

export default {
  name: "SignUp",
  methods: {
    googleSignIn: function() {
        this.$store.dispatch('login');
    },

    googleSignOut: function() {
        this.$store.dispatch('logout');
    }
  },
};
</script>