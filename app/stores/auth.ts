import { defineStore } from "pinia";
import type { AuthUser } from "~/types/auth";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null
        // token: null
    }),

    actions: {
        login(user: AuthUser) {
            this.user = user
            localStorage.setItem('auth_user', JSON.stringify(user))
        },

        logout() {
            this.user = null
            localStorage.removeItem('auth_user')
        },

        init() {
            const raw = localStorage.getItem('auth_user')

            if(!raw) {
                this.user = null
                return
            }

            try {
                this.user = JSON.parse(raw)
            } catch {
                this.user = null
                localStorage.removeItem('auth_user')
            }
        }
    }
})