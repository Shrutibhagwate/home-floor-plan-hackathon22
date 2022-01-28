import { createApp } from 'vue'
import App from './App.vue'
import { initializeApp } from 'firebase/app';
import  store  from './store/index.js';
import  BaseButton  from './components/ui/BaseButton.vue';
import  BaseDialog  from './components/ui/BaseDialog.vue';
import  BaseCard  from './components/ui/BaseCard.vue';
import  BaseSpinner  from './components/ui/BaseSpinner.vue';
import router from './router';
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

const firebaseConfig = {
    apiKey: "AIzaSyBepUnB8ttxVngJxjFBC_y8LnCZEApbRPI",
    authDomain: "home-floor-plan-hackathon.firebaseapp.com",
    projectId: "home-floor-plan-hackathon",
    storageBucket: "home-floor-plan-hackathon.appspot.com",
    messagingSenderId: "695612281856",
    appId: "1:695612281856:web:3ae4ebc8124f1b0bb474e5"
};

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(VueSidebarMenu);
app.use(store);
app.use(router);
app.component("BaseButton", BaseButton);
app.component("BaseDialog", BaseDialog);
app.component("BaseCard", BaseCard);
app.component("BaseSpinner", BaseSpinner);
app.mount('#app');
