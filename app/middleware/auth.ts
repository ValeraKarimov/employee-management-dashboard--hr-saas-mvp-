import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    if(!auth.user) {
        // auth.init()
        return navigateTo('/login')
    }

    // if(!auth.user && to.path !== '/login') {
    //     return navigateTo('/login');
    // }
})