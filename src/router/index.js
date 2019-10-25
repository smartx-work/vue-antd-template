import vueAuthRouter from '@packages/vueAuthRouter'
import store from '@/store'
import routes from './routes'


const vueAuthRouterInstance = vueAuthRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    state: store.getters,
})

export default vueAuthRouterInstance
export const router = vueAuthRouterInstance.router
export const menulist = vueAuthRouterInstance.menulist
