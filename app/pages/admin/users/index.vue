<script setup>
    definePageMeta({
        middleware: ['auth', 'role'],
        role: 'admin'
    })
</script>