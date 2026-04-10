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
            localStorage.setItem('user', JSON.stringify(user))
        },

        logout() {
            this.user = null
            localStorage.removeItem('user')
        },

        init() {
            const data = localStorage.getItem('user')
            if(data) {
                this.user = JSON.parse(data)
            }
        }
    }
})