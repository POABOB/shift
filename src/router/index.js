import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('../components/Login.vue')
    },
    {
        path: '/',
        component: () => import('../components/Shift.vue'),
    }
]

const createRouter = () => new Router({
	// mode: 'history',
    routes: constantRoutes
})

const router = createRouter()

export default router