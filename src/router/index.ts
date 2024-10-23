import { createRouter, createWebHistory } from 'vue-router';
import index from '@/pages/index.vue';
import Calendar from '@/pages/Calendar.vue';

const routes = [
    { path: '/', component: index },
    { path: '/calendar', component: Calendar },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
