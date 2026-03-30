import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | { 
            id: number
            name: string; 
            role: 'admin' | 'employee' }
        // token: null
    }),

    actions: {
        login(user: { id: number, name: string; role: 'admin' | 'employee' }) {
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