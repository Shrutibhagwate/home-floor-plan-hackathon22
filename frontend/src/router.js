import { createRouter, createWebHistory } from 'vue-router';
import TheProfile from './components/profile/TheProfile.vue';
import TheRequest from './components/request/TheRequest.vue';
import RequestForm from './components/request/RequestForm.vue';
import HomePage from './components/home/HomePage.vue';
import TheRole from './components/profile/TheRole.vue';
import OrdersPage from './components/orders/OrdersPage.vue';
import WorkflowPage from './components/home/WorkflowPage.vue';
import ThePortfolio from './components/profile/ThePortfolio.vue';
import store from './store';

const router = createRouter({
    routes:[
        {path: '/', component: HomePage},
        {path: '/profile', component: TheProfile, meta: {requiresAuth: true}},
        {path: '/role', component: TheRole, meta: {requiresAuth: true}},
        {path: '/requests', component: TheRequest, meta: {requiresAuth: true}},
        {path: '/request-form', component: RequestForm, meta: {requiresAuth: true}},
        {path: '/orders', component: OrdersPage, meta: {requiresAuth: true}},
        {path: '/how-it-works', component: WorkflowPage},
        {path: '/portfolio', component: ThePortfolio, meta: {requiresAuth: true}},
    ],
    history: createWebHistory()
});

router.beforeEach(function(to, _, next) {
    if(to.meta.requiresAuth && !store.getters.isAuthenticated)
    {
        next('/');
    }
    else
    {
        next();
    }

})

export default router;