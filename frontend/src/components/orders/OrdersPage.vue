<template>
  <div class="overallContainer">
    <sidebar-menu
      class="sidebar"
      :menu="menu"
      :hideToggle="true"
      :collapsed="collapsed"
      @item-click="onItemClick"
      @collapse="onCollapse"
    />
    <div v-if="selectedOption || selectedOption === 0">
      <orders-list :order-type="getOrderType" ></orders-list>
    </div>
    <div v-else class="orders-page-initial-text">
      <div>Welcome to the orders page! Please select type of orders from side panel.</div>
  </div>
  </div>
  <div v-if="isLoading">
      <base-spinner></base-spinner>
  </div>
</template>

<script>
import  OrdersList  from './OrdersList.vue';

export default {
  name: "App",
  components: {
      OrdersList
  },
  data() {
    return {
      menu: [
        {
          title: "Ongoing Projects",
        },
        {
          title: "Project Requests",
        },
        {
          title: "Past Projects",
        },
      ],
      collapsed: false,
      selectedOption: null,
      isLoading: false
    };
  },
  methods: {
    async onItemClick(e, i) {
      this.selectedOption = i.id;
      this.isLoading = true;
      await this.$store.dispatch('getArchitectRequests');
      this.isLoading = false;
    },
    onCollapse(c) {
      this.collapsed = c;
    }
  },
  computed: {
      getOrderType() {
        if (this.selectedOption === 0) {
            return 'getOngoingRequestsForUser'
        } else if (this.selectedOption === 1) {
            return 'getPendingRequestsForUser';
        } else if (this.selectedOption === 2) {
            return 'getPastRequestsForUser';
        }
        return 'getRequestsForUser';
    }
  }
};
</script>

<style>
#view {
  padding-left: 350px;
}
#view.collapsed {
  padding-left: 50px;
}

/* .sidebar {
    margin-top: 5em;
} */
.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: "\f105";
  font-family: "FontAwesome";
}
.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f07e";
  font-family: "FontAwesome";
}
.sidebar.v-sidebar-menu .vsm--item {
  padding: 1em;
}

.overallContainer{
    display: flex;
    min-height: calc(100vh - 5em);
    overflow-x: hidden;
}
.sidebar.v-sidebar-menu {
    position: inherit;
}
.orders-page-initial-text {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-direction: column;
}
</style>
