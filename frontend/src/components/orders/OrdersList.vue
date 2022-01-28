<template>
    <div v-if="orderType === 'getOngoingRequestsForUser'" class="title">Ongoing Projects -</div>
    <div v-else-if="orderType === 'getPendingRequestsForUser'" class="title">Project Requests -</div>
    <div v-else-if="orderType === 'getPastRequestsForUser'" class="title">Past Projects -</div>
    <div class="orders-container">
        <base-card v-for="request in getRequests" :key="request" >
          <div class="base-card-container">
            <div class="left-container">
              <div class="date">{{request.date}}</div>
              <div class="container"><b>Customer Name:</b> {{request.customerName}}</div>
              <div class="container" v-if="request.customerPhoneNumber"><b>Customer Contact Number:</b> {{request.customerPhoneNumber}}</div>
              <div class="container"><b>Total Square Feet:</b> {{request.total_sq_ft}}</div>
              <div class="container"><b>Bedrooms:</b> {{request.bedrooms}}</div>
              <div class="container"><b>Bathrooms:</b> {{request.bathrooms}}</div>
              <div class="container" v-if="request.description && request.description.length"><b>Description:</b> {{request.description}}</div>
            </div>
            <div class="right-container"><b>Status:</b> {{request.status}}</div>
          </div>
          <div class="container image-container" v-if="request.image"><img :src="request.image" style="max-width: 100%"></div>
          <div class="container" v-if="orderType === 'getOngoingRequestsForUser'" style="text-align: center">
            <base-button @click="respond('Completed', request.reqId)" :mode="'green'">Complete</base-button>
          </div> 
          <div class="container" v-else-if="orderType === 'getPendingRequestsForUser'" style="text-align: center">
            <base-button @click="respond('Ongoing', request.reqId)" :mode="'green'">Accept</base-button>
            <base-button @click="respond('Rejected', request.reqId)" :mode="'red'">Reject</base-button>
          </div> 
        </base-card>
        <div v-if="!getRequests || !getRequests.length" class="make-center">
          No Projects Found
        </div>
    </div>
    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>
</template>

<script>
export default {
    emits: ['save-data'],
    props: ['orderType'],
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
    computed: {
        getRequests() {
            return this.$store.getters[this.orderType];
        },
    },
    methods: {
      async respond(status, id) {
        this.isLoading = true;
        await this.$store.dispatch('updateStatus', {id: id, status: status});
        this.isLoading = false;
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
    position: absolute;
    right: 4em;
    top: 9em;
}

.orders-container {
  width: calc(100vw - 290px);
  display: flex;
  flex-direction: column;
}

.make-center {
  text-align: center;
  font-size: 1.25rem;
  margin-top: 20vh;
}

.title {
  margin: 1rem;
  font-size: 0.75rem;
}

.base-card-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  /* min-width: 40rem; */
  width: 38rem;
}

.date {
    font-size: 0.75rem;
}

.container {
    margin-top: 0.75rem;
}

.image-container {
  /* width: 40rem; */
    display: flex;
    justify-content: center;
}

.right-container {
      min-width: fit-content;
}
</style>
