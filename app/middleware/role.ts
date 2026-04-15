import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    if(!auth.user) return navigateTo('/login')

    const role = to.meta.role

    if (role && auth.user.role !== role) {
        return navigateTo('/dashboard')
    }
})