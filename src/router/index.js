import Vue from 'vue'
import Router from 'vue-router'
import indexPage from '../view/hello.vue'
import numberKeyBoard from '../view/numberKeyBoard.vue'
Vue.use(Router);
const router = new Router({
    routes: [{
            path: '/',
            component: indexPage,
        },
        {
            path: '/nuberKeyBoard',
            component: numberKeyBoard,
        }
    ]
})
export default router;
