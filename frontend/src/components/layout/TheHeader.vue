<template>
    <header>
        <nav>
            
            <div class="outer-container">
              <router-link to="/">
                  <span><img alt="Vue logo" src="../../assets/logo_livspace.png"></span>
              </router-link>
              <router-link to="/how-it-works">How It Works</router-link>
              <router-link v-if="isLoggedIn && isCustomer" to="/requests">Requests</router-link>
              <base-button v-if="!isLoggedIn || (isLoggedIn && isCustomer)" @click="proceed">Consult Online Now</base-button>
              <router-link v-if="isLoggedIn && !isCustomer" to="/orders">Orders</router-link>
              <router-link v-if="isLoggedIn && !isCustomer" to="/portfolio">Portfolio</router-link>
            </div>
            
            <ul>
                <li v-if="!isLoggedIn">
                    <base-button @click="login">
                        Login
                    </base-button>
                </li>
                <li v-else class="logout dropdown">
                  <!-- <base-button @click="logout">
                    Logout
                  </base-button> -->
                  <img :src="getProfileImage()" @click="toggleProfileDropdown">
                  <div class="dropdown-content">
                    <a href="/profile" to="/profile">Open Profile</a>
                    <a href="#" @click="tryToLogout">Logout</a>
                  </div>
                </li>
            </ul>
        </nav>
    </header>

    <base-dialog :show="showDialog" title="Do you want to Logout?" @close="tryClose" @yes="logout" v-if="showDialog">
    </base-dialog>

    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>

</template>

<script>
import BaseButton from '../ui/BaseButton.vue';
export default {
  components: { BaseButton },
  data() {
      return {
          isProfileDropdownOpen: false,
          options: [
              {
                  name: "Open Profile",
                  link: "/profile"
              },
              {
                  name: "Open Settings",
                  link: "/settings"
              },
              {
                  name: "Logout",
              },
          ],
          showDialog: false,
          isLoading: false
      }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isCustomer() {
        return this.$store.getters.getRole === 'customer';
    }
  },
  methods: {
    async login() {
        this.isLoading = true;
        await this.$store.dispatch('login');
        this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;
      this.showDialog = false;
      await this.$store.dispatch('logout');
      this.isLoading = false;
      this.$router.replace('/');
    },
    tryToLogout() {
        this.showDialog = true;
    },
    getProfileImage() {
        return this.$store.getters.getProfileImage;
    },
    toggleProfileDropdown() {
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen
    },
    tryClose() {
        this.showDialog = false;
    },
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
.dropdown-container {
    position: absolute;
    top: 5em;
}
.logout {
    position: relative;
    display: flex;
} 

header {
  width: 100%;
  height: 5rem;
  /* background-color: #3d008d; */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
}

header a {
  text-decoration: none;
  color: rgba(235,89,95);
  display: inline-block;
  /* padding: 0.75rem 1.5rem; */
  border: 1px solid transparent;
}

/* a:active,
a:hover,
a.router-link-active {
  border: 1px solid rgba(235,89,95);
} */

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
  cursor: pointer;
}

img {
    height: 3em;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 3rem;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #f1f1f1}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: rgba(235,89,95);
}

.outer-container {
  display: flex;
  align-items: center;
}

.outer-container > * {
  margin-right: 3rem;
}
</style>