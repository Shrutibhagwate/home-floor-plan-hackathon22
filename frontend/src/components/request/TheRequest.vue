<template>
    <div class="request">
        <base-button @click="onNewRequest">New Request</base-button>
    </div>
    <base-card v-for="request in requests" :key="request" >
      <div class="base-card-container">
        <div class="left-container">
          <div class="date">{{request.date}}</div>
          <div class="container"><b>Architect Name:</b> {{request.architectName}}</div>
          <div class="container"><b>Total Square Feet:</b> {{request.total_sq_ft}}</div>
          <div class="container"><b>Bedrooms:</b> {{request.bedrooms}}</div>
          <div class="container"><b>Bathrooms:</b> {{request.bathrooms}}</div>
          <div class="container" v-if="request.description && request.description.length"><b>Description:</b> {{request.description}}</div>
        </div>
        <div class="right-container"><b>Status:</b> {{request.status}}</div>
      </div>
      <div class="container" v-if="request.image" style="display: flex; justify-content: center;"><img :src="request.image" style="max-width: 100%"></div>
    </base-card>
    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>
</template>

<script>
export default {
    emits: ['save-data'],
    data(){
        return {
            name: {
                val: this.$store.getters.getName,
                isValid: true
            },
            email: {
                val: this.$store.getters.getEmail,
                isValid: true
            },
            phone: {
                val: this.$store.getters.getPhone,
                isValid: true
            },
            formIsValid: true,
            isLoading: false
        }
    },
    async created() {
      this.isLoading = true;
      await this.$store.dispatch('getAllRequests');
      this.isLoading = false;
    },
    computed: {
      requests() {
        return this.$store.getters.getRequests;
      }
    },
    methods : {
        onNewRequest() {
            this.$router.replace('/request-form');
        }
    }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}

.request {
    text-align: center;
    margin-top: 5rem;
}

.base-card-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.date {
    font-size: 0.75rem;
}

.container {
    margin-top: 0.75rem;
}

.right-container {
      min-width: fit-content;
}
</style>