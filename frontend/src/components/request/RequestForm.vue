<template>
    <base-card v-if="!formSubmitted">
      <div class="title">Please fill out below details to raise a design request</div>
      <form @submit.prevent = "submitForm">
        <div class="form-control" :class="{invalid: !total_sq_ft.isValid}">
            <label for="total">Total Square Feet Area</label>
            <input type="number" id="total" v-model.trim="total_sq_ft.val" @blur="clearValidity('total_sq_ft')">
            <p v-if="!total_sq_ft.isValid">Total must be greater than zero.</p>
        </div>
        <div class="form-control" :class="{invalid: !floors.isValid}">
            <label for="floors">Required Number Of Floors</label>
            <input type="number" id="floors" v-model.trim="floors.val" @blur="clearValidity('floors')">
            <p v-if="!floors.isValid">Floors must be greater than zero.</p>
        </div>
        <div class="form-control" :class="{invalid: !bedrooms.isValid}">
            <label for="bedrooms">Required Bedrooms</label>
            <input type="number" id="bedrooms" v-model.trim="bedrooms.val" @blur="clearValidity('bedrooms')">
            <p v-if="!bedrooms.isValid">Bedrooms count must be valid.</p>
        </div>
        <div class="form-control" :class="{invalid: !bathrooms.isValid}">
            <label for="bathrooms">Required Bathrooms</label>
            <input type="number" id="bathrooms" v-model.trim="bathrooms.val" @blur="clearValidity('bathrooms')">
            <p v-if="!bathrooms.isValid">Bathrooms count must be valid.</p>
        </div>
        <div class="form-control" :class="{invalid: !description.isValid}">
            <label for="description">Description</label>
            <input type="text" id="description" v-model.trim="description.val" @blur="clearValidity('description')">
            <p v-if="!description.isValid">Description must be valid.</p>
        </div>
        <div class="form-control">
          <input ref="file" accept="image/*" v-on:change="handleFileUpload($event)"  type="file">
        </div>
        <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
        <base-button>Next</base-button>
      </form>
    </base-card>
    <div v-else class="architect-container">
        <h2>Please select an Architect</h2>
        <base-card v-for="architect in architects" :key="architect" @click="selectArchitect(architect.uid)" :class="{selected: selectedArchitect === architect.uid}">
          <div class="base-card-container">
            <div class="left-container">
              <div style="font-weight: bold">{{architect.displayName}}</div>
              <div v-if="architect.portfolio && architect.portfolio.description">{{architect.portfolio.description}}</div>
            </div>
            <div class="right-container">
              <div>Rating: 5/5</div>
            </div>
          </div>
          <div class="container" v-if="architect.portfolio && architect.portfolio.image"><img :src="architect.portfolio.image" style="max-width: 100%"></div>
        </base-card>
        <base-button @click="confirm">Confirm</base-button>
    </div>
    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>
</template>

<script>
export default {
    emits: ['save-data'],
    data(){
        return {
            total_sq_ft: {
                val: '',
                isValid: true
            },
            floors: {
                val: '',
                isValid: true
            },
            bedrooms: {
                val: '',
                isValid: true
            },
            bathrooms: {
                val: '',
                isValid: true
            },
            description: {
                val: '',
                isValid: true
            },
            image: {
              val: '',
              isValid: true
            },
            formIsValid: true,
            file: null,
            formSubmitted: false,
            selectedArchitect: null,
            isLoading: false
        }
    },
    computed: {
      architects() {
        return this.$store.getters.getArchitects;
      }
    },
    async created() {
      this.isLoading = true;
      await this.$store.dispatch('getAllArchitects');
      this.isLoading = false;
    },
    methods : {
        handleFileUpload(event) {
          this.getBase64(event.target.files[0]);
        },
        async getBase64(file) {
          this.isLoading = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.image.val = reader.result;
            this.isLoading = false;
          } 
        },
        clearValidity(input) {
            this[input].isValid = true;
        },
        validateForm(){
            this.formIsValid = true;
            if(this.total_sq_ft.val <= 0)
            {
              this.total_sq_ft.isValid = false;
              this.formIsValid = false;
            } else if(this.floors <= 0) {
              this.floors.isValid = false;
              this.formIsValid = false;
            } else if(this.bedrooms.val <= 0) {
              this.bedrooms.isValid = false;
              this.formIsValid = false;
            } else if(this.bathrooms.val <= 0) {
              this.bathrooms.isValid = false;
              this.formIsValid = false;
            } else if(this.description === '') {
              this.description.isValid = false;
              this.formIsValid = false;
            }
        },
        submitForm() {
          this.formSubmitted = false;

            this.validateForm();
            if(!this.formIsValid) {
                return ;
            }

            this.formSubmitted = true;
        },
        selectArchitect(id) {
          if (id) {
            this.selectedArchitect = id;
          }
        },
        async confirm() {
          this.isLoading = true;
          if (this.selectedArchitect) {
            let architect = this.$store.getters.getArchitects.find(architect => architect.uid === this.selectedArchitect);
            const formData = {
                date: new Date().toDateString(),
                total_sq_ft: this.total_sq_ft.val,
                floors: this.floors.val,
                bedrooms: this.bedrooms.val,
                bathrooms: this.bathrooms.val,
                description: this.description.val,
                status: 'Pending',
                id: JSON.parse(localStorage.getItem("user")).uid,
                toId: this.selectedArchitect,
                customerName: this.$store.getters.getName,
                customerPhoneNumber: this.$store.getters.getPhone,
                architectName: architect.displayName,
                image: this.image.val
            };

            this.$store.dispatch('addRequest', {request: formData});
            this.isLoading = false;
          }
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
  background-color: rgb(253, 229, 230);;
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

.request {
    position: absolute;
    right: 4em;
    top: 9em;
}

.architect-container {
  text-align: center;
}

.selected {
  background-color: rgb(188, 224, 152);
  cursor: pointer;
}

.title {
  margin-bottom: 2rem;
  font-size: 0.75rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.base-card-container {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.left-container {
  text-align: initial;
}

.container {
    margin-top: 0.75rem;
}
</style>