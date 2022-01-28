<template>
    <img alt="Vue logo" src="../../assets/home2.jpeg">

    <div v-if="!isLoggedIn || (isLoggedIn && isCustomer)">
        <h1 class="main-title">Your dream home in 5 steps!</h1>
        <div class="book-button">
            <h3>Looking to design your home floor plan? Here's how you can get started</h3>
            <div class="listContainer">
                <ul>
                    <li>Raise a request with requirements</li>
                    <li>Choose a suitable Architect</li>
                    <li>Free consultation with Architect</li>
                    <li>Pay the booking amount</li>
                    <li>Get the final design</li>
                </ul>
            </div>
            
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>

        </div>
    </div>

    <div v-else>
        <h2 class="main-title">Looking to generate more leads and deliver stunning houses. Join us and let us make people happy</h2>
        <div class="book-button">
            <div class="listContainer">
                <ul>
                    <li>Join with us as an Architect</li>
                    <li>Update your portfolio to highlight your best work</li>
                    <li>Get project requests from customer</li>
                    <li>Create design based on project requirements</li>
                    <li>Submit the design</li>
                </ul>
            </div>
            
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>

        </div>
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
    },
    computed: {
        isCustomer() {
            return this.$store.getters.getRole === 'customer';
        },
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
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

ul {
    /* width: 50%; */
    text-align: left;
}

.listContainer
{
    display: flex;
    justify-content: center;
}

li {
    margin-bottom: 1rem;
}

</style>