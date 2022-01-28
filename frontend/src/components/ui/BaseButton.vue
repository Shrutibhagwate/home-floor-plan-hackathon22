<template>
    <button v-if="!link" :class="mode">
        <slot></slot>
    </button>
    <router-link v-else :to="to" :class="mode">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    props: {
        link: {
            type: Boolean,
            required: false,
            default: false
        },
        to: {
            type: String,
            required: false,
            default: '/'
        },
        mode: {
            type: String,
            required: false,
            default: null
        },
        green: {
          type: Boolean,
          required: false,
          default: false
        },
        red: {
          type: Boolean,
          required: false,
          default: false
        }
    }
}
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: rgba(235,89,95);
  border: 1px solid rgba(235,89,95);
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
}

/* a:hover,
a:active,
button:hover,
button:active {
  background-color: rgba(235,89,95);
  border-color: rgba(235,89,95);
}

.flat {
  background-color: transparent;
  color: rgba(235,89,95);
  border: none;
}

.outline {
  background-color: transparent;
  border-color: rgba(235,89,95);
  color: rgba(235,89,95);
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: rgba(235,89,95);
} */

.red {
  background-color: red;
  border: 1px solid red;
}

.green {
  background-color: green;
  border: 1px solid green;
}
</style>