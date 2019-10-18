import vueAuthRouter from '@packages/vueAuthRouter'
import store from '@/store'
import routes from './routes'

export default vueAuthRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    get state () {
        return { authoritys: store.getters.authoritys, isLogin: store.getters.isLogin }
    },
})
