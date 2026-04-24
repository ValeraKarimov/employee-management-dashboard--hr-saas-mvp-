<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

if (auth.user) {
  navigateTo('/dashboard')
} else {
  navigateTo('/login')
}
</script>