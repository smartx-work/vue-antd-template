import vueAuthRouter from '@packages/vueAuthRouter'
import store from '@/store'
import routes from './routes'

export default vueAuthRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    state: store.getters,
})
