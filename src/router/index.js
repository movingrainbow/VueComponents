import Vue from 'vue'
import Router from 'vue-router'
import indexPage from '../view/hello.vue'
import numberKeyBoard from '../view/numberKeyBoard.vue'
import videoPlayer from '../view/videoPlayer.vue'
Vue.use(Router);
const router = new Router({
    routes: [{
            path: '/',
            component: indexPage,
        },
        {
            path: '/numberKeyBoard',
            component: numberKeyBoard,
        }, {
            path: '/videoPlayer',
            component: videoPlayer
        }
    ]
})
export default router;