<template>
    <base-card>
      <form @submit.prevent = "submitForm">
        <div class="form-control" :class="{invalid: !name.isValid}">
            <label for="name">Name</label>
            <input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" :class="{disabled: !isEditMode}" :tabindex="isEditMode ? 0 : -1">
            <p v-if="!name.isValid">Name must not be empty</p>
        </div>
        <div class="form-control" :class="{invalid: !email.isValid}">
            <label for="email">Email</label>
            <input type="email" id="email" v-model.trim="email.val" @blur="clearValidity('email')" disabled>
            <p v-if="!email.isValid">Email must be valid</p>
        </div>
        <div class="form-control" :class="{invalid: !phone.isValid}">
            <label for="phone">Phone</label>
            <input type="number" id="phone" v-model.trim="phone.val" @blur="clearValidity('phone')" :class="{disabled: !isEditMode}">
            <p v-if="!phone.isValid">Phone must be valid</p>
        </div>
        <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
        <base-button v-if="!isEditMode" @click="editForm">Edit</base-button>
        <base-button v-else>Submit</base-button>
      </form>
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
            isEditMode: false,
            isLoading: false
        }
    },
    methods : {
        clearValidity(input) {
            this[input].isValid = true;
        },
        validateForm(){
            this.formIsValid = true;
            if(this.name.val === '')
            {
              this.name.isValid = false;
              this.formIsValid = false;
            } else if (this.email.val === '' || !this.email.val.indexOf('@')) {
              this.email.isValid = false;
              this.formIsValid = false;
            } else if (this.phone.val === '' || this.phone.val  && this.phone.val.length !== 10) {
              this.phone.isValid = false;
              this.formIsValid = false;
            }
        },
        async submitForm() {
            this.isLoading = true;
            this.validateForm();
            if(!this.formIsValid)
            {
                return ;
            }
            const formData = {
                displayName: this.name.val,
                email: this.email.val,
                phoneNumber: this.phone.val
            };
            this.$store.dispatch('updateProfile', {request: formData});
            this.isEditMode = false;
            this.isLoading = false;
        },
        editForm() {
          this.isEditMode = true;
        }
    },
    watch: {
      '$store.getters.getName': function() {
        this.name.val = this.$store.getters.getName
      },
      '$store.getters.getEmail': function() {
        this.email.val = this.$store.getters.getEmail
      },
      '$store.getters.getPhone': function() {
        this.phone.val = this.$store.getters.getPhone
      }
    }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  background-color: rgba(239, 239, 239, 0.3);
  color: rgb(84, 84, 84);
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
  background-color: rgb(253, 229, 230);
  outline: none;
  border-color: rgb(241, 104, 108);
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: rgb(241, 104, 108) solid 1px;
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>