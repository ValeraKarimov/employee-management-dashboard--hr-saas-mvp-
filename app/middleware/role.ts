import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    if(!auth.user) return

    const role = to.meta.role

    if (role && auth.user.role !== role) {
        return navigateTo('/dashboard')
    }
})