import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    if(!auth.user) {
        return navigateTo('/login')
    }

})