<template>
    <base-card>
      <form @submit.prevent = "submitForm">
        <div class="form-control">
          <img :src="getImage" alt="" style="max-width:100%">
          <input ref="file" v-on:change="handleFileUpload($event)"  type="file">
        </div>
        <div class="form-control">
            <label for="description">Description</label>
            <input type="text" id="description" v-model.trim="description.val">
        </div>
        <base-button>Save</base-button>
      </form>
    </base-card>
    <div v-if="isLoading">
        <base-spinner></base-spinner>
    </div>
</template>

<script>
export default {
    data(){
        return {
            description: {
                val: this.$store.getters.getPortfolio && this.$store.getters.getPortfolio.description
            },
            image: {
              val: null
            },
            isLoading: false
        }
    },
    methods : {
        async submitForm() {
            this.isLoading = true;
            const formData = {
                description: this.description.val,
                image: this.getImage
            };
            await this.$store.dispatch('updatePortfolio', {portfolio: formData});
            this.isLoading = false;
        },
        handleFileUpload(event) {
          this.getBase64(event.target.files[0]);
        },
        getBase64(file) {
          this.isLoading = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.image.val = reader.result;
            this.isLoading = false;
          } 
        }
    },
    computed: {
      getImage() {
        return this.image.val ? this.image.val : this.$store.getters.getPortfolio ? this.$store.getters.getPortfolio.image : null;
      }
    },
    watch: {
      '$store.getters.getPortfolio.description': function() {
        this.description.val = this.$store.getters.getPortfolio.description
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